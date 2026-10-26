import React, { useState } from 'react';
import { Target, BarChart3, Clock, ListOrdered } from 'lucide-react';
import { OwnerWinLossReport } from './OwnerWinLossReport';
import { RoundResult } from '../types/yuki';

export const AdminPanel: React.FC<{
  lang: 'km' | 'en';
  betSlips: any[];
  recentResults: RoundResult[];
  activeBets: any[];
}> = ({ lang, betSlips, recentResults, activeBets }) => {
  const [forcedNumber, setForcedNumber] = useState<number>(1);

  const handleForceResult = async () => {
    await fetch('/api/admin/force-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: forcedNumber }),
    });
    alert(`Forced next result to ${forcedNumber}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-black text-slate-900">Admin Control Panel</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Control Next Result
          </h3>
          <div className="flex gap-2">
              <input 
                  type="number" 
                  value={forcedNumber} 
                  onChange={(e) => setForcedNumber(Number(e.target.value))}
                  className="border p-2 rounded w-20"
                  min="1" max="12"
              />
              <button 
                  onClick={handleForceResult}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
              >
                  Force Result
              </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Active Bets ({activeBets.length})
          </h3>
          <div className="max-h-40 overflow-y-auto">
            {activeBets.length === 0 ? <p className="text-slate-500">No active bets</p> : (
                <ul className="space-y-1">
                    {activeBets.map(bet => (
                        <li key={bet.id} className="text-sm border-b pb-1">
                            {bet.label}: <span className="font-bold">{bet.amount.toLocaleString()} ៛</span>
                        </li>
                    ))}
                </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-purple-600" />
            Recent Results
        </h3>
        <div className="max-h-60 overflow-y-auto text-sm">
          {recentResults.length === 0 ? <p className="text-slate-500">No results</p> : (
            <table className="w-full text-left">
              <thead>
                <tr><th>Round</th><th>Date</th><th>Time</th><th>Number</th></tr>
              </thead>
              <tbody>
                {recentResults.slice(0, 10).map(r => (
                  <tr key={`${r.drawDate}-${r.roundId}`} className="border-b">
                    <td>{r.roundId}</td>
                    <td>{r.drawDate}</td>
                    <td>{r.drawTime}</td>
                    <td className="font-bold">{r.number} ({r.khmerName})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Owner Win/Loss Report
        </h3>
        <OwnerWinLossReport 
            lang={lang}
            betSlips={betSlips}
            balance={200000}
            onBackToGame={() => {}}
        />
      </div>
    </div>
  );
};
