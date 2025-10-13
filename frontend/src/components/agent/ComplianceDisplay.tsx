import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

import { ComplianceAuditResult } from '@/hooks/agent/types';

interface ComplianceDisplayProps {
  auditResult: ComplianceAuditResult | null;
  onFixClick?: (fix: string) => void;
}

export function ComplianceDisplay({ auditResult, onFixClick }: ComplianceDisplayProps) {
  const [expandedIssues, setExpandedIssues] = useState(false);
  const [expandedFixes, setExpandedFixes] = useState(false);

  if (!auditResult) {
    return null;
  }

  const getRiskColor = (score: number) => {
    if (score < 0.3) return 'text-green-600 bg-green-100';
    if (score < 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskIcon = (score: number) => {
    if (score < 0.3) return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    if (score < 0.7) return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
    return <XCircleIcon className="w-5 h-5 text-red-600" />;
  };

  const getRiskLabel = (score: number) => {
    if (score < 0.3) return 'Low Risk';
    if (score < 0.7) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <Card className="p-4 mb-4 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getRiskIcon(auditResult.risk_score)}
          <h3 className="font-semibold text-lg">Compliance Audit Results</h3>
        </div>
        <Badge className={getRiskColor(auditResult.risk_score)}>
          {getRiskLabel(auditResult.risk_score)} ({(auditResult.risk_score * 100).toFixed(1)}%)
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <InformationCircleIcon className="w-4 h-4 mr-1" />
            Standards Checked
          </h4>
          <div className="flex flex-wrap gap-1">
            {auditResult.standards_checked.map((standard, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {standard}
              </Badge>
            ))}
          </div>
        </div>

        {auditResult.contract_address && (
          <div>
            <h4 className="font-medium mb-2">Contract Address</h4>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {auditResult.contract_address}
            </code>
          </div>
        )}
      </div>

      {auditResult.issues.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium flex items-center">
              <XCircleIcon className="w-4 h-4 mr-1 text-red-500" />
              Issues Found ({auditResult.issues.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedIssues(!expandedIssues)}
            >
              {expandedIssues ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          {expandedIssues && (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {auditResult.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {auditResult.fixes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
              Recommended Fixes ({auditResult.fixes.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedFixes(!expandedFixes)}
            >
              {expandedFixes ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          {expandedFixes && (
            <ul className="space-y-2">
              {auditResult.fixes.map((fix, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm flex-1">{fix}</span>
                  {onFixClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onFixClick(fix)}
                    >
                      Apply
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4 pt-2 border-t">
        Audit completed at {new Date(auditResult.timestamp).toLocaleString()}
      </div>
    </Card>
  );
}
