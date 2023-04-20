import {Job} from 'prisma/prisma-client';

export type TJob = Omit<Job, 'id' | 'job_name' | 'created_date'>;
