import type { ReportData } from "@/lib/reportData"
import { CleanPage01Profile } from "./pages/CleanPage01Profile"
import { CleanPage02Combination } from "./pages/CleanPage02Combination"
import { CleanPage03Snapshot1 } from "./pages/CleanPage03Snapshot1"
import { CleanPage04BehaviorPattern } from "./pages/CleanPage04BehaviorPattern"
import { CleanPage05FailureMap } from "./pages/CleanPage05FailureMap"
import { CleanPage06FactorDetail } from "./pages/CleanPage06FactorDetail"
import { CleanPage07Snapshot2 } from "./pages/CleanPage07Snapshot2"
import { CleanPage08Environment } from "./pages/CleanPage08Environment"
import { CleanPage09Prescription } from "./pages/CleanPage09Prescription"
import { CleanPage10Plan } from "./pages/CleanPage10Plan"
import { CleanPage11Summary } from "./pages/CleanPage11Summary"
import { CleanPage12Blueprint } from "./pages/CleanPage12Blueprint"

export interface CleanReportTemplateProps {
  reportData: ReportData
}

export function CleanReportTemplate({ reportData }: CleanReportTemplateProps) {
  return (
    <div className="clean-report-preview flex flex-col gap-8 pb-16 print:block print:gap-0 print:pb-0">
      <div className="print:break-after-page"><CleanPage01Profile reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage02Combination reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage03Snapshot1 reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage04BehaviorPattern reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage05FailureMap reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage06FactorDetail reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage07Snapshot2 reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage08Environment reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage09Prescription reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage10Plan reportData={reportData} /></div>
      <div className="print:break-after-page"><CleanPage11Summary reportData={reportData} /></div>
      <div className="print:break-after-auto"><CleanPage12Blueprint reportData={reportData} /></div>
    </div>
  )
}
