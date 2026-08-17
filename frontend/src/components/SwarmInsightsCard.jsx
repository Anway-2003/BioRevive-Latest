const SwarmInsightsCard = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-white space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-emerald-400">Swarm Agentic Insights</h3>
        <span className={`px-2 py-0.5 text-xs rounded font-mono ${
          insights.geoSentinelThreatLevel === 'CRITICAL_DEGRADATION' 
            ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
            : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {insights.geoSentinelThreatLevel || 'ANALYZING...'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700/50">
          <p className="text-slate-400 text-xs">Bio-Botanist Advice</p>
          <p className="font-medium mt-1 text-emerald-200">{insights.recommendedSpecies || 'Pending Analysis'}</p>
        </div>
        <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700/50">
          <p className="text-slate-400 text-xs">Carbon Potential & Cost</p>
          <p className="font-medium mt-1 text-emerald-200">
            {insights.carbonCreditPotential ? `${insights.carbonCreditPotential} tCO2e` : '0 tCO2e'} | ₹{insights.estimatedRestorationCost || 0}
          </p>
        </div>
      </div>

      <div className="text-xs bg-slate-800/60 p-2.5 rounded border border-slate-700">
        <span className="text-slate-400">Action Plan: </span>
        <span className="text-slate-200">{insights.collectiveActionPlan || 'Collecting telemetry parameters...'}</span>
      </div>
    </div>
  );
};

export default SwarmInsightsCard;