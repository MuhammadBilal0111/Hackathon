import { Cloud, Droplets, Wind } from "lucide-react"

export function WeatherCard() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">WEATHER</p>
          <p className="text-xs text-muted-foreground mb-4">San Francisco, CA</p>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          <Cloud className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      {/* Temperature */}
      <div className="mb-6">
        <p className="text-5xl font-bold text-foreground">22°C</p>
        <p className="text-sm text-muted-foreground mt-1">Partly Cloudy</p>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Droplets className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-medium text-foreground">65%</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Wind className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="text-sm font-medium text-foreground">8 km/h</p>
          </div>
        </div>
      </div>
    </div>
  )
}
