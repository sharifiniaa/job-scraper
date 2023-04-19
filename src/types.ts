import {Job} from '../prisma/generated/prisma-client-js';

export type TJob = Omit<Job, 'id' | 'job_name' | 'created_date'>;
