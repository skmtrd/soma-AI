import type { CompletedWorkEntity, loadingWorkEntity } from 'api/@types/work';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type { FailedWorkEntity } from '../../../api/@types/work';
import { getContentKey, getImageKey } from '../service/getS3Key';
import { s3 } from 'service/s3Client';
export const workMethod = {
  create: async (val: {
    novelUrl: string;
    title: string;
    author: string;
  }): Promise<loadingWorkEntity> => {
    const id = brandedId.work.entity.parse(ulid());

    return {
      id,
      status: 'loading',
      novelUrl: val.novelUrl,
      title: val.title,
      author: val.author,
      contentUrl: await s3.getSignedUrl(getContentKey(id)),
      createdTime: Date.now(),
      imageUrl: null,
      errorMsg: null,
    };
  },
  complete: async (loadingWork: loadingWorkEntity): Promise<CompletedWorkEntity> => {
    return {
      ...loadingWork,
      status: 'completed',
      imageUrl: await s3.getSignedUrl(getImageKey(loadingWork.id)),
    };
  },
  failure: async (loadingWork: loadingWorkEntity, errorMsg: string): Promise<FailedWorkEntity> => {
    return {
      ...loadingWork,
      status: 'failed',
      errorMsg,
    };
  },
};
