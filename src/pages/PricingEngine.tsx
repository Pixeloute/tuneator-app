import { PageLayout } from "@/components/layout/page-layout";

export default function PricingEngine() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-4">Pricing Engine</h1>
      <div className="bg-card p-6 rounded-lg shadow">
        {/* Pricing Engine UI goes here */}
        <p>Upload your metadata file and calculate dynamic pricing for Tuneator's Metadata Pricing Tool.</p>
      </div>
    </PageLayout>
  );
} 