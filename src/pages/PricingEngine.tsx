import React, { useState } from 'react';
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const marginOptions = [0.3, 0.4, 0.5];

export default function PricingEngine() {
  const [variants, setVariants] = useState(1200);
  const [avgTime, setAvgTime] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(20);
  const [margin, setMargin] = useState(0.5);
  const [tax, setTax] = useState(0.25);
  const [variantToSong, setVariantToSong] = useState(6);

  // Calculations
  const labourHours = (variants * avgTime) / 60;
  const labourCost = labourHours * hourlyRate;
  const revenue = labourCost / (1 - margin);
  const grossProfit = revenue - labourCost;
  const taxValue = grossProfit * tax;
  const netProfit = grossProfit - taxValue;
  const netMargin = (netProfit / revenue) * 100;
  const estimatedSongs = variants / variantToSong;
  const pricePerVariant = revenue / variants;

  // Validation
  const hasError = [variants, avgTime, hourlyRate, variantToSong].some(v => v <= 0);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-4">🎯 Metadata Pricing Engine</h1>
      <p className="text-muted-foreground mb-6">
        Upload your metadata sheet and automatically generate pricing based on variants, time, tax, and net margin goals.
      </p>

      <div className="grid grid-cols-2 gap-6 max-w-3xl mb-8">
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label>Variants</Label>
            </TooltipTrigger>
            <TooltipContent>Number of unique variants in your metadata</TooltipContent>
          </Tooltip>
          <Input type="number" value={variants} min={1} onChange={e => setVariants(+e.target.value)} />
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label>Variant-to-Song Ratio</Label>
            </TooltipTrigger>
            <TooltipContent>How many variants per song?</TooltipContent>
          </Tooltip>
          <Input type="number" value={variantToSong} min={1} step={0.1} onChange={e => setVariantToSong(+e.target.value)} />
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label>Avg Time per Variant (min)</Label>
            </TooltipTrigger>
            <TooltipContent>Average time to process one variant (minutes)</TooltipContent>
          </Tooltip>
          <Input type="number" value={avgTime} min={1} onChange={e => setAvgTime(+e.target.value)} />
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label>Hourly Rate (£)</Label>
            </TooltipTrigger>
            <TooltipContent>Labour cost per hour (£)</TooltipContent>
          </Tooltip>
          <Input type="number" value={hourlyRate} min={1} onChange={e => setHourlyRate(+e.target.value)} />
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label>Target Net Margin (%)</Label>
            </TooltipTrigger>
            <TooltipContent>Target net margin after tax</TooltipContent>
          </Tooltip>
          <select
            className="input w-full border rounded px-2 py-1"
            value={margin}
            onChange={e => setMargin(+e.target.value)}
            aria-label="Target Net Margin"
          >
            {marginOptions.map(opt => (
              <option key={opt} value={opt}>{opt * 100}%</option>
            ))}
          </select>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label>Corporation Tax (%)</Label>
            </TooltipTrigger>
            <TooltipContent>Corporation tax rate</TooltipContent>
          </Tooltip>
          <Input type="number" value={tax * 100} min={0} max={100} onChange={e => setTax(+e.target.value / 100)} />
        </div>
      </div>

      <Card className="max-w-3xl mb-8">
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold">📊 Job Quote Summary</h2>
          <p>🧾 <strong>Variants:</strong> {variants.toLocaleString()}</p>
          <p>🎵 <strong>Estimated Songs:</strong> {Math.round(estimatedSongs).toLocaleString()}</p>
          <p>💸 <strong>Price/Variant:</strong> £{pricePerVariant.toFixed(2)}</p>
          <p>💼 <strong>Total Revenue:</strong> £{revenue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
          <p>🕒 <strong>Labour Cost:</strong> £{labourCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
          <p>📈 <strong>Net Profit:</strong> £{netProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
          <p>🧾 <strong>Corporation Tax:</strong> £{taxValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
          <p>🟢 <strong>Net Margin:</strong> {netMargin.toFixed(2)}%</p>
        </CardContent>
      </Card>

      <Button className="mt-4" disabled={hasError} onClick={() => alert('TODO: Export to PDF')}>
        📥 Download Quote (PDF)
      </Button>
    </PageLayout>
  );
} 