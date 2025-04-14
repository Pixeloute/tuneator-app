
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, LineChart, Sparkles, Zap, Target, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { PredictionsChart } from "./insights/predictions-chart";
import { RecommendationsList } from "./insights/recommendations-list";
import { HealthScoreGauge } from "./insights/health-score-gauge";

interface RoyaltyInsightsPanelProps {
  insightsData: any;
}

export function RoyaltyInsightsPanel({ insightsData }: RoyaltyInsightsPanelProps) {
  // Helper function to format AI insights text with better styling
  const formatInsights = (text: string) => {
    // Add styling to numbered items and highlights
    if (!text) return null;
    
    // Split by newlines and format
    return text.split('\n').map((line, index) => {
      // Check if this is a numbered point
      const numberedPoint = line.match(/^(\d+)\.\s(.+)$/);
      if (numberedPoint) {
        return (
          <div key={index} className="flex gap-2 mt-2">
            <Badge variant="secondary" className="h-6 w-6 flex items-center justify-center rounded-full">
              {numberedPoint[1]}
            </Badge>
            <p>{numberedPoint[2]}</p>
          </div>
        );
      }
      
      // Check if this is a heading/subheading
      if (line.match(/^[A-Z][\w\s]+:$/)) {
        return <h4 key={index} className="font-semibold mt-3 mb-1">{line}</h4>;
      }
      
      // Regular text with empty line handling
      return line.trim() ? <p key={index} className="my-1">{line}</p> : <div key={index} className="h-2" />;
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-electric" />
              AI Royalty Insights
            </CardTitle>
            <CardDescription>
              Data-driven analysis and recommendations
            </CardDescription>
          </div>
          {insightsData.healthScore && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Royalty Health:</span>
              <Badge 
                className={`${
                  insightsData.healthScore.score >= 75 ? "bg-green-100 text-green-800" :
                  insightsData.healthScore.score >= 50 ? "bg-amber-100 text-amber-800" :
                  "bg-red-100 text-red-800"
                }`}
              >
                {insightsData.healthScore.score}/100
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">
              <Zap className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="predictions">
              <TrendingUp className="h-4 w-4 mr-2" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Target className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="health">
              <Percent className="h-4 w-4 mr-2" />
              Health Score
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-4 space-y-4">
            <div className="bg-secondary/10 p-4 rounded-lg">
              {insightsData.insights ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {formatInsights(insightsData.insights)}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No AI insights available</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="mt-4 space-y-4">
            {insightsData.predictions ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <span className="text-sm text-muted-foreground">Next 3 Months</span>
                      <span className="text-2xl font-bold">${insightsData.predictions.nextThreeMonths.toLocaleString()}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <span className="text-sm text-muted-foreground">Next 6 Months</span>
                      <span className="text-2xl font-bold">${insightsData.predictions.nextSixMonths.toLocaleString()}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <span className="text-sm text-muted-foreground">Next Year</span>
                      <span className="text-2xl font-bold">${insightsData.predictions.nextYear.toLocaleString()}</span>
                    </CardContent>
                  </Card>
                </div>
                
                <PredictionsChart monthlyProjections={insightsData.predictions.monthlyProjections} />
                
                <div className="mt-4 text-sm text-muted-foreground italic">
                  <p>
                    Confidence: {(insightsData.predictions.confidence * 100).toFixed(0)}% | 
                    Methodology: {insightsData.predictions.methodology}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground italic">No prediction data available</p>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-4 space-y-4">
            {insightsData.recommendations ? (
              <RecommendationsList recommendations={insightsData.recommendations} />
            ) : (
              <p className="text-muted-foreground italic">No recommendations available</p>
            )}
          </TabsContent>
          
          <TabsContent value="health" className="mt-4 space-y-4">
            {insightsData.healthScore ? (
              <>
                <div className="flex flex-col items-center justify-center mb-6">
                  <HealthScoreGauge score={insightsData.healthScore.score} />
                  <h3 className="text-lg font-semibold mt-2">{insightsData.healthScore.interpretation}</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Category Scores</h4>
                      <div className="space-y-2">
                        {Object.entries(insightsData.healthScore.categories).map(([category, score]: [string, any]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center">
                              <div className="w-32 h-2 bg-secondary/20 rounded-full overflow-hidden mr-2">
                                <div 
                                  className={`h-full rounded-full ${
                                    score >= 20 ? "bg-green-500" : 
                                    score >= 10 ? "bg-amber-500" : 
                                    "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.min(100, (score / 25) * 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{score}/25</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Improvement Areas</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {insightsData.healthScore.improvementAreas.map((area: string, index: number) => (
                          <li key={index} className="text-sm">{area}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground italic">No health score data available</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
