
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Printer } from 'lucide-react';
import { TAOverview } from '@/components/TAOverview';
import { MilestonePlan } from '@/components/MilestonePlan';
import { BookiesBoard } from '@/components/BookiesBoard';
import { TopRisks } from '@/components/TopRisks';
import { ActionLogStatus } from '@/components/ActionLogStatus';
import { MaterialTracker } from '@/components/MaterialTracker';
import { ServicesTracker } from '@/components/ServicesTracker';
import { ExcelHandler } from '@/components/ExcelHandler';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const Index = () => {
  const [comments, setComments] = useState('');
  const { toast } = useToast();
  const { loading } = useSupabaseData();

  const handleExportCSV = () => {
    const csvContent = `Comments,Timestamp\n"${comments}","${new Date().toISOString()}"`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'turnaround_comments.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Comments Exported",
      description: "Your comments have been saved to CSV file."
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</div>
          <div className="text-gray-600">Fetching live data from Supabase</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header with Controls */}
        <div className="flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Turnaround Management Dashboard</h1>
            <p className="text-lg text-gray-600">Driven by Precision, Powered by Teamwork... <span className="text-green-600 font-semibold">Live Data from Supabase</span></p>
          </div>
          <div className="flex gap-3">
            <ExcelHandler />
            <Button 
              onClick={handlePrint}
              className="bg-gray-800 hover:bg-gray-900"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print PDF
            </Button>
          </div>
        </div>

        {/* Dashboard Grid - Optimized for A3 Landscape */}
        <div className="grid grid-cols-12 gap-6 print:gap-4">
          {/* TA Overview - Full width */}
          <div className="col-span-12">
            <TAOverview />
          </div>

          {/* Milestone Plan - Full width */}
          <div className="col-span-12">
            <MilestonePlan />
          </div>

          {/* Bookies Board and Top Risks */}
          <div className="col-span-6">
            <BookiesBoard />
          </div>
          <div className="col-span-6">
            <TopRisks />
          </div>

          {/* Action Log Status  */}
          <div className="col-span-6">
            <ActionLogStatus />
          </div>

          {/* Material and Services Trackers */}
          <div className="col-span-6">
            <MaterialTracker />
          </div>
          <div className="col-span-6">
            <ServicesTracker />
          </div>

          {/* Comments Section */}
          <div className="col-span-12 print:hidden">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Main Concerns / Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your concerns, remarks, or comments here..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <Button 
                    onClick={handleExportCSV}
                    variant="outline"
                    disabled={!comments.trim()}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Comments to CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
