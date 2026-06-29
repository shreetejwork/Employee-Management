import { COMPANY } from "../../constants/company";
import CompanyLogo from "../ui/CompanyLogo";

/** Official letterhead block — salary slips & printable documents */
const CompanyLetterhead = ({ compact = false, showTagline = true }) => (
  <div className="border-b-2 border-primary pb-4 mb-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <CompanyLogo
          variant="icon"
          boxed
          className="w-25 h-25 object-contain"
        />
        <div className="min-w-0">
          <h2 className="text-3xl font-bold text-primary leading-tight">
            {COMPANY.name}
          </h2>
          <p className="text-[11px] text-text-secondary mt-1">
            <div>{COMPANY.website}</div>

            <div>{COMPANY.email}</div>
          </p>
        </div>
      </div>
    </div>

    <div className="mt-3 pt-3 border-t border-border/60 space-y-1">
      <p className="text-[10px] text-text-secondary leading-relaxed">
        {COMPANY.registeredOffice}
      </p>
      <p className="text-[10px] text-text-secondary leading-relaxed">
        {COMPANY.manufacturingUnit}
      </p>
    </div>
  </div>
);

export default CompanyLetterhead;
