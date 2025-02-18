import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { ScrollArea } from '../components/ui/scroll-area'
import { FileCode, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface AnalysisReportProps {
  results: {
    ui_impacts: Record<string, string[]>;
    compatibility_requirements: {
      system_versions: string[];
      screen_resolutions: string[];
      orientations: string[];
      device_types: string[];
    };
    status: string;
  };
}

export function AnalysisReport({ results }: AnalysisReportProps) {
  const hasUIImpacts = Object.keys(results.ui_impacts).length > 0;
  const hasCompatibilityRequirements = Object.values(results.compatibility_requirements).some(reqs => reqs.length > 0);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileCode className="h-5 w-5" />
          <span>Code Analysis Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <Alert variant={hasUIImpacts ? "warning" : "success"}>
          <AlertDescription className="flex items-center space-x-2">
            {hasUIImpacts ? (
              <>
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>UI changes detected - compatibility testing recommended</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>No significant UI impacts detected</span>
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* UI Impacts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">UI Impacts</h3>
          {hasUIImpacts ? (
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(results.ui_impacts).map(([file, impacts], index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">
                    {file}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <ul className="space-y-2">
                        {impacts.map((impact, i) => (
                          <li key={i} className="text-sm">
                            • {impact}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">No UI changes detected in the code.</p>
          )}
        </div>

        {/* Compatibility Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Compatibility Testing Requirements</h3>
          {hasCompatibilityRequirements ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.compatibility_requirements).map(([category, requirements], index) => (
                requirements.length > 0 && (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {category.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {requirements.map((req, i) => (
                          <li key={i} className="text-sm">
                            • {req}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No specific compatibility testing requirements identified.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
