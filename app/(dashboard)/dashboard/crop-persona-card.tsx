import { Leaf, Zap } from "lucide-react";
export function CropPersonaCard() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            PRIMARY CROP
          </p>
          <h3 className="text-lg font-semibold text-foreground">Wheat</h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          <Leaf className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Growth Stage</p>
          <p className="text-sm font-medium text-foreground">
            Flowering (45 days)
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Expected Yield</p>
          <p className="text-sm font-medium text-foreground">
            8.2 tons/hectare
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <Zap className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs font-medium text-foreground">Healthy</span>
        </div>
      </div>
    </div>
  );
}
