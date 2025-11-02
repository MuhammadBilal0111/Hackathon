'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { CropPhotoForm } from '@/components/forms/crop-photo-form';
import { AnalysisResults } from '@/components/analysis-result';
import { analyzeCrop } from '@/src/services/cropService';

interface AnalysisData {
  detectedCrop: string;
  healthStatus: 'Healthy' | 'At Risk' | 'Critical';
  pestDisease: string;
  treatmentPlan: string;
}

interface FormData {
  photo: File;
  cropType: string;
  notes?: string;
}

export default function AIAnalysisPage() {
  const { t } = useTranslation('common');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);

      const uploadData = new FormData();
      uploadData.append('photo', formData.photo);
      uploadData.append('cropType', formData.cropType);
      if (formData.notes) {
        uploadData.append('notes', formData.notes);
      }

      const result = await analyzeCrop(uploadData);

      setAnalysis({
        detectedCrop: result.detectedCrop,
        healthStatus: result.healthStatus,
        pestDisease: result.pestDisease,
        treatmentPlan: result.treatmentPlan,
      });
      setShowResults(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResult = async () => {
    try {
      setIsLoading(true);
      console.log('Saving analysis result...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Result saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAI = async () => {
    try {
      setIsLoading(true);
      console.log('Asking AI for more details...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('AI response would appear here!');
    } catch (error) {
      console.error('Ask AI failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          {t('aiCropAnalysis')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6 bg-card border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {t('uploadCropPhoto')}
              </h2>
              <CropPhotoForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
              />

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <p className="text-sm text-muted-foreground">{t('quickActions')}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition text-sm font-medium">
                    {t('takePhoto')}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition text-sm font-medium">
                    {t('chooseFromGallery')}
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            {showResults && analysis ? (
              <Card className="p-6 bg-card border border-border">
                <AnalysisResults
                  detectedCrop={analysis.detectedCrop}
                  healthStatus={analysis.healthStatus}
                  pestDisease={analysis.pestDisease}
                  treatmentPlan={analysis.treatmentPlan}
                  onSave={handleSaveResult}
                  onAskAI={handleAskAI}
                  isLoading={isLoading}
                />
              </Card>
            ) : (
              <Card className="p-6 bg-muted border border-border flex items-center justify-center min-h-96">
                <p className="text-center text-muted-foreground">
                  {t('uploadToSeeResults')}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
