import {relocateMe} from './relocateMe';
import {siaExplains} from './siaExplains';

type companiesData = {
  relocateCom: Record<string, number>;
  newCompanies: number;
  siaExplains: Record<string, number>;
};

export async function collectCompanies(): Promise<companiesData | undefined> {
  try {
    const companiesData: companiesData = {
      newCompanies: 0,
      relocateCom: {
        companies: 0,
      },
      siaExplains: {
        newCompanies: 0,
        companies: 0,
      },
    };
    const relocateCom = await relocateMe();
    if (relocateCom) {
      companiesData.relocateCom.companies = relocateCom.companies;
      companiesData.newCompanies += relocateCom.newCompanies;
    }

    const siaExplainData = await siaExplains();
    if (siaExplainData) {
      companiesData.siaExplains.companies = siaExplainData.companies;
      companiesData.newCompanies += siaExplainData.newCompanies;
    }
    return companiesData;
  } catch (err) {
    console.log(err);
  }
}
