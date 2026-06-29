import { useCompanyContext } from '../../context/CompanyContext';
import { formatCurrencyDecimal, formatDays } from '../../utils/formatters';
import { amountToWords } from '../../utils/numberToWords';
import CompanyLetterhead from '../../components/ui/CompanyLetterhead';

const AttendanceRow = ({ leftLabel, leftValue, rightLabel, rightValue }) => (
  <div className="grid grid-cols-2 gap-4 text-xs border-b border-border/40 py-1">
    <p>
      <span className="text-text-secondary">{leftLabel} :</span>{' '}
      <span className="font-medium">{formatDays(leftValue)}</span>
    </p>
    <p>
      <span className="text-text-secondary">{rightLabel} :</span>{' '}
      <span className="font-medium">{formatDays(rightValue)}</span>
    </p>
  </div>
);

const AmountRow = ({ label, amount }) => (
  <tr className="border-b border-border/40">
    <td className="py-1 text-text-secondary text-xs">{label}</td>
    <td className="py-1 text-right font-medium text-xs">{formatCurrencyDecimal(amount)}</td>
  </tr>
);

const SalarySlipPreview = ({ slip, employee }) => {
  const { companyInfo } = useCompanyContext();

  if (!slip || !employee) return null;

  const earnings = [
    { label: 'Basic + DA', amount: slip.basicPlusDA },
    { label: 'H.R.A.', amount: slip.adjustedHra },
    { label: 'Fixed Allowance', amount: slip.fixedAllowance },
    { label: 'Medical', amount: slip.medicalAllowance },
    { label: 'F.B.A.', amount: slip.fba },
    { label: 'Misc. Earnings', amount: slip.miscEarnings },
    { label: 'Conveyance', amount: slip.conveyance },
  ];

  const deductions = [
    { label: 'Provident Fund', amount: slip.pf },
    { label: 'E.S.I.', amount: slip.esi },
    { label: 'Loan', amount: slip.loan },
    { label: 'Profession Tax', amount: slip.professionalTax },
    { label: 'Income Tax', amount: slip.incomeTax },
  ];

  return (
    <div
      id="salary-slip-print"
      className="bg-white border border-border rounded-xl p-8 max-w-3xl mx-auto text-text"
    >
      <CompanyLetterhead />

      <div className="flex items-start justify-between mb-4 pb-3 border-b border-border">
        <p className="text-sm font-semibold text-primary tracking-wide">SALARY SLIP</p>
        <div className="text-right text-xs text-text-secondary space-y-0.5">
          <p>{slip.slipId || 'PREVIEW'}</p>
          <p>
            {slip.salaryMonthName} {slip.salaryYear}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div className="space-y-0.5">
          <p>
            <span className="text-text-secondary">Employee ID:</span>{' '}
            <span className="font-medium">{employee.employeeId}</span>
          </p>
          <p>
            <span className="text-text-secondary">Name:</span>{' '}
            <span className="font-medium">{employee.fullName}</span>
          </p>
          <p>
            <span className="text-text-secondary">Department:</span> {employee.department}
          </p>
        </div>
        <div className="space-y-0.5">
          <p>
            <span className="text-text-secondary">Designation:</span> {employee.designation}
          </p>
          <p>
            <span className="text-text-secondary">Grade:</span> {employee.grade}
          </p>
          <p>
            <span className="text-text-secondary">Bank A/C:</span> {employee.accountNumber || '-'}
          </p>
        </div>
      </div>

      <div className="mb-5 p-3 border border-border rounded-lg bg-card/30">
        <AttendanceRow
          leftLabel="WORKING DAYS"
          leftValue={slip.workingDays}
          rightLabel="CASUAL LEAVE"
          rightValue={slip.casualLeave}
        />
        <AttendanceRow
          leftLabel="PRESENT DAYS"
          leftValue={slip.presentDays}
          rightLabel="EARNED LEAVE"
          rightValue={slip.earnedLeave}
        />
        <AttendanceRow
          leftLabel="SUNDAYS"
          leftValue={slip.sundays}
          rightLabel="SICK LEAVE"
          rightValue={slip.sickLeave}
        />
        <AttendanceRow
          leftLabel="OVER TIME"
          leftValue={slip.overtimeHours}
          rightLabel="C/OFF TAKEN"
          rightValue={slip.cOffTaken}
        />
        <AttendanceRow
          leftLabel="BALANCE CL"
          leftValue={slip.balanceCL}
          rightLabel="BALANCE SL"
          rightValue={slip.balanceSL}
        />
        <AttendanceRow
          leftLabel="BALANCE EL"
          leftValue={slip.balanceEL}
          rightLabel="BALANCE C/OFF"
          rightValue={slip.balanceCOff}
        />
        <p className="text-xs pt-2 font-medium">
          <span className="text-text-secondary">Cumulative Present Days :</span>{' '}
          {slip.cumulativePresentDays ?? 0}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <div className="flex justify-between text-xs font-semibold text-primary mb-2 pb-1 border-b border-border">
            <span>Earnings</span>
            <span>Amount INR.</span>
          </div>
          <table className="w-full">
            <tbody>
              {earnings.map((item) => (
                <AmountRow key={item.label} label={item.label} amount={item.amount} />
              ))}
              <tr className="font-semibold border-t border-border">
                <td className="py-2 text-primary text-xs">Total Gross Earnings</td>
                <td className="py-2 text-right text-primary text-xs">
                  {formatCurrencyDecimal(slip.grossEarnings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className="flex justify-between text-xs font-semibold text-primary mb-2 pb-1 border-b border-border">
            <span>Deductions</span>
            <span>Amount INR.</span>
          </div>
          <table className="w-full">
            <tbody>
              {deductions.map((item) => (
                <AmountRow key={item.label} label={item.label} amount={item.amount} />
              ))}
              <tr className="font-semibold border-t border-border">
                <td className="py-2 text-danger text-xs">Total Deductions</td>
                <td className="py-2 text-right text-danger text-xs">
                  {formatCurrencyDecimal(slip.totalDeductions)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Net Salary</span>
          <span className="font-semibold">{formatCurrencyDecimal(slip.netSalary)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Adj. Amount</span>
          <span className="font-semibold">{formatCurrencyDecimal(slip.adjAmount)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-border pt-3">
          <span className="text-primary font-semibold">Final Pay</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrencyDecimal(slip.finalPay ?? slip.netSalary)}
          </span>
        </div>
        <p className="text-xs font-medium pt-2 border-t border-border/50">
          <span className="text-text-secondary">RUPEES:</span>{' '}
          {amountToWords(slip.finalPay ?? slip.netSalary)}
        </p>
      </div>

      <div className="flex justify-between items-end pt-4 border-t border-border">
        <p className="text-xs text-text-secondary">This is a computer-generated salary slip.</p>
        <div className="text-center">
          <div className="h-14" />
          <div className="w-44 border-t border-border pt-2">
            <p className="text-xs font-medium text-text-secondary">Authorized Signature</p>
            <p className="text-[10px] text-text-secondary mt-1">{companyInfo.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipPreview;
