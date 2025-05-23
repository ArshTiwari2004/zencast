import type React from "react"
import { Check, X } from "lucide-react"

const ComparisonSection: React.FC = () => {
  const competitors = [
    {
      name: "Riverside",
      features: {
        "Auto-rendered videos": false,
        "Real-time chunked upload": false,
        "Dynamic layouts": false,
        "Offline resume": false,
        "Local recording": true,
      },
    },
    {
      name: "Zoom",
      features: {
        "Auto-rendered videos": false,
        "Real-time chunked upload": false,
        "Dynamic layouts": false,
        "Offline resume": false,
        "Local recording": false,
      },
    },
    {
      name: "SquadCast",
      features: {
        "Auto-rendered videos": false,
        "Real-time chunked upload": true,
        "Dynamic layouts": false,
        "Offline resume": true,
        "Local recording": true,
      },
    },
    {
      name: "Zencast",
      features: {
        "Auto-rendered videos": true,
        "Real-time chunked upload": true,
        "Dynamic layouts": true,
        "Offline resume": true,
        "Local recording": true,
      },
      highlight: true,
    },
  ]

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why creators choose Zencast</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            While others focus on just recording, we deliver the complete solution
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Platform</th>
                {Object.keys(competitors[0].features).map((feature) => (
                  <th key={feature} className="text-center p-4 text-gray-300 font-medium min-w-[140px]">
                    {feature}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor, index) => (
                <tr
                  key={competitor.name}
                  className={`border-t border-gray-800/50 transition-all duration-300 hover:scale-[1.02] ${
                    competitor.highlight
                      ? "bg-gradient-to-r from-emerald-500/10 to-white/5 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                      : "hover:bg-gray-900/30"
                  }`}
                >
                  <td className="p-4">
                    <div
                      className={`font-semibold transition-all duration-300 ${competitor.highlight ? "text-emerald-400" : "text-white"}`}
                    >
                      {competitor.name}
                      {competitor.highlight && (
                        <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full animate-pulse">
                          That's us!
                        </span>
                      )}
                    </div>
                  </td>
                  {Object.values(competitor.features).map((hasFeature, featureIndex) => (
                    <td key={featureIndex} className="p-4 text-center">
                      {hasFeature ? (
                        <Check
                          className={`w-5 h-5 mx-auto transition-all duration-300 hover:scale-110 ${competitor.highlight ? "text-emerald-400" : "text-green-400"}`}
                        />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto transition-all duration-300 hover:scale-110" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ComparisonSection
