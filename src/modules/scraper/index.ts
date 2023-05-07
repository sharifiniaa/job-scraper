import {jobCollector} from "./jobCollector";
import {filterKeyword} from "./filterKeywords";
import {checkAndSaveJobs} from "./saveJobs";

export const scraper = async (locations: string[], keyword: string, isCheckDescription?: boolean) => {
    try {
        const jobs = (await jobCollector(locations, keyword)) ?? [];
        const filteredJobs = isCheckDescription ? await filterKeyword(jobs) : jobs;
        await checkAndSaveJobs(filteredJobs);
    } catch (err) {
        console.log(err);
    } finally {
        console.log('job done!');
    }
};