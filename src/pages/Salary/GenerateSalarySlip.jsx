import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { useSalaryContext } from "../../context/SalaryContext";
import { useToastContext } from "../../context/ToastContext";
import { MONTHS } from "../../constants/formOptions";
import { formatCurrency } from "../../utils/formatters";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import SalarySlipPreview from "./SalarySlipPreview";
import { downloadSalarySlipPdf } from "../../utils/pdfDownload";
import {
  IoEyeOutline,
  IoPrintOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
} from "react-icons/io5";

const GenerateSalarySlip = () => {
  const { employees } = useEmployeeContext();
  const { generateSalarySlip, calculatePreview } = useSalaryContext();
  const { addToast } = useToastContext();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.status === "Active"),
    [employees],
  );

  const employeeOptions = activeEmployees.map((e) => ({
    value: e.id,
    label: `${e.employeeId} - ${e.fullName}`,
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: String(currentYear - i),
  }));

  const monthOptions = MONTHS.map((m, i) => ({ value: i, label: m }));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: "",
      salaryMonth: new Date().getMonth(),
      salaryYear: currentYear,
      presentDays: 0,
      casualLeave: 0,
      earnedLeave: 0,
      sickLeave: 0,
      cOffTaken: 0,
      balanceCL: 0,
      balanceSL: 0,
      balanceEL: 0,
      balanceCOff: 0,
      overtimeHours: 0,
      overtime: 0,
      bonus: 0,
      incentive: 0,
      pf: 0,
      esi: 0,
      loan: 0,
      professionalTax: 0,
      incomeTax: 0,
      otherDeductions: 0,
      adjAmount: 0,
    },
  });

  const watchedEmployeeId = watch("employeeId");
  const formValues = watch();

  useEffect(() => {
    if (watchedEmployeeId) {
      const emp = activeEmployees.find((e) => e.id === watchedEmployeeId);
      setSelectedEmployee(emp || null);
    } else {
      setSelectedEmployee(null);
    }
  }, [watchedEmployeeId, activeEmployees]);

  const buildPreviewData = (data) => {
    const monthIndex = Number(data.salaryMonth);
    const calc = calculatePreview(data, selectedEmployee);
    return {
      ...data,
      salaryMonthName: MONTHS[monthIndex],
      ...calc,
    };
  };

  const handlePreview = () => {
    if (!selectedEmployee) {
      addToast("Please select an employee", "warning");
      return;
    }
    setPreview(buildPreviewData(formValues));
    setShowPreview(true);
  };

  const onGenerate = async (data) => {
    if (!selectedEmployee) {
      addToast("Please select an employee", "warning");
      return;
    }
    setGenerating(true);
    try {
      const monthIndex = Number(data.salaryMonth);
      const slip = await generateSalarySlip(
        {
          ...data,
          salaryMonth: monthIndex,
          salaryMonthName: MONTHS[monthIndex],
        },
        selectedEmployee,
      );
      addToast("Salary slip generated successfully!", "success");
      setPreview({ ...slip, salaryMonthName: MONTHS[monthIndex] });
      setShowPreview(true);
    } catch {
      addToast("Failed to generate salary slip", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const slipId = preview?.slipId || "PREVIEW";
      const employeeId = selectedEmployee?.employeeId || "employee";
      await downloadSalarySlipPdf(
        "salary-slip-print",
        `salary-slip-${employeeId}-${slipId}.pdf`,
      );
      addToast("PDF downloaded successfully", "success");
    } catch {
      addToast("Failed to download PDF", "error");
    } finally {
      setDownloading(false);
    }
  };

  const liveCalc = selectedEmployee
    ? calculatePreview(formValues, selectedEmployee)
    : null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onGenerate)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Select Employee">
              <Select
                label="Employee"
                required
                options={employeeOptions}
                error={errors.employeeId?.message}
                {...register("employeeId", {
                  required: "Please select an employee",
                })}
              />
              {selectedEmployee && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 p-4 bg-card rounded-lg">
                  <div>
                    <p className="text-xs text-text-secondary">Employee ID</p>
                    <p className="text-sm font-medium">
                      {selectedEmployee.employeeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Name</p>
                    <p className="text-sm font-medium">
                      {selectedEmployee.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Department</p>
                    <p className="text-sm font-medium">
                      {selectedEmployee.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Designation</p>
                    <p className="text-sm font-medium">
                      {selectedEmployee.designation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Grade</p>
                    <p className="text-sm font-medium">
                      {selectedEmployee.grade}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Basic + DA</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(
                        (selectedEmployee.basicPay || 0) +
                          (selectedEmployee.da || 0),
                      )}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Salary Period">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Select
                  label="Salary Month"
                  required
                  options={monthOptions}
                  {...register("salaryMonth")}
                />
                <Select
                  label="Salary Year"
                  required
                  options={yearOptions}
                  {...register("salaryYear")}
                />
              </div>
            </Card>

            <Card title="Attendance & Leave">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="Present Days"
                  type="number"
                  step="0.01"
                  required
                  {...register("presentDays", { required: true, min: 0 })}
                />
                <Input
                  label="Casual Leave"
                  type="number"
                  step="0.01"
                  {...register("casualLeave")}
                />
                <Input
                  label="Earned Leave"
                  type="number"
                  step="0.01"
                  {...register("earnedLeave")}
                />
                <Input
                  label="Sick Leave"
                  type="number"
                  step="0.01"
                  {...register("sickLeave")}
                />
                <Input
                  label="C/OFF Taken"
                  type="number"
                  step="0.01"
                  {...register("cOffTaken")}
                />
                <Input
                  label="Over Time (Hours)"
                  type="number"
                  step="0.01"
                  {...register("overtimeHours")}
                />
              </div>
              {liveCalc && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-3 bg-card rounded-lg text-sm">
                  <div>
                    <p className="text-xs text-text-secondary">Working Days</p>
                    <p className="font-medium">{liveCalc.workingDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Sundays</p>
                    <p className="font-medium">{liveCalc.sundays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Total Days</p>
                    <p className="font-medium">{liveCalc.totalDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">
                      Cumulative Present
                    </p>
                    <p className="font-medium">
                      {liveCalc.cumulativePresentDays}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Leave Balances">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="Balance CL"
                  type="number"
                  step="0.01"
                  {...register("balanceCL")}
                />
                <Input
                  label="Balance SL"
                  type="number"
                  step="0.01"
                  {...register("balanceSL")}
                />
                <Input
                  label="Balance EL"
                  type="number"
                  step="0.01"
                  {...register("balanceEL")}
                />
                <Input
                  label="Balance C/OFF"
                  type="number"
                  step="0.01"
                  {...register("balanceCOff")}
                />
              </div>
            </Card>

            <Card title="Earnings & Deductions">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="Overtime Amount"
                  type="number"
                  {...register("overtime")}
                />
                <Input
                  label="Bonus (Misc. Earnings)"
                  type="number"
                  {...register("bonus")}
                />
                <Input
                  label="Incentive (Misc. Earnings)"
                  type="number"
                  {...register("incentive")}
                />
                <Input
                  label="Provident Fund"
                  type="number"
                  {...register("pf")}
                />
                <Input label="E.S.I." type="number" {...register("esi")} />
                <Input label="Loan" type="number" {...register("loan")} />
                <Input
                  label="Profession Tax"
                  type="number"
                  {...register("professionalTax")}
                />
                <Input
                  label="Income Tax"
                  type="number"
                  {...register("incomeTax")}
                />
                <Input
                  label="Adj. Amount"
                  type="number"
                  {...register("adjAmount")}
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Salary Summary">
              {liveCalc ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Gross Earnings</span>
                    <span className="font-semibold text-success">
                      {formatCurrency(liveCalc.grossEarnings)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      Total Deductions
                    </span>
                    <span className="font-semibold text-danger">
                      {formatCurrency(liveCalc.totalDeductions)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Net Salary</span>
                    <span className="font-semibold">
                      {formatCurrency(liveCalc.netSalary)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-primary">
                      Final Pay
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(liveCalc.finalPay)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">
                  Select an employee to see calculations
                </p>
              )}
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                icon={<IoEyeOutline />}
                onClick={handlePreview}
              >
                Preview
              </Button>
              <Button
                type="submit"
                icon={<IoDocumentTextOutline />}
                loading={generating}
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
      </form>

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Salary Slip Preview"
        size="lg"
      >
        <SalarySlipPreview slip={preview} employee={selectedEmployee} />
        <div className="flex justify-end gap-3 mt-6 no-print">
          <Button
            variant="outline"
            icon={<IoDownloadOutline />}
            loading={downloading}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            icon={<IoPrintOutline />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default GenerateSalarySlip;
