"use client";

import { Leaf, Zap } from "lucide-react";
import { useLocalization } from "@/lib/localization";

export function CropPersonaCard() {
  const { t } = useLocalization();

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {t("primaryCrop")}
          </p>
          <h3 className="text-lg font-semibold text-foreground">
            {t("wheat")}
          </h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          <Leaf className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {t("growthStage")}
          </p>
          <p className="text-sm font-medium text-foreground">
            {t("flowering45")}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {t("expectedYield")}
          </p>
          <p className="text-sm font-medium text-foreground">
            {t("yieldValue")}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <Zap className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs font-medium text-foreground">
            {t("healthy")}
          </span>
        </div>
      </div>
    </div>
  );
}
