
import React from 'react';
import RadialProgress from '../../charts/RadialProgress';
import type { IndividualAnalysis } from '../../../types';

interface QuadFactorScoresProps {
  scores: IndividualAnalysis['quad_factor_scores'];
  rationale: IndividualAnalysis['quad_factor_score_rationale'];
}

const QuadFactorScores: React.FC<QuadFactorScoresProps> = ({ scores, rationale }) => {
    if (!scores || !rationale) {
        return <div className="p-4 text-slate-500">Performance ratings not available.</div>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
          <div className="flex justify-center h-full">
              <RadialProgress
                title="Technical Rating"
                score={scores.technical_score}
                rationale={rationale.technical_summary}
              />
          </div>
          <div className="flex justify-center h-full border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-8 md:pt-0 md:pl-8">
              <RadialProgress
                title="Sentiment Rating"
                score={scores.sentiment_score}
                rationale={rationale.sentiment_summary}
              />
          </div>
          <div className="flex justify-center h-full border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-8 md:pt-0 md:pl-8">
              <RadialProgress
                title="Risk Alignment"
                score={scores.risk_alignment_score}
                rationale={rationale.risk_alignment_summary}
              />
          </div>
        </div>
    );
};

export default QuadFactorScores;
