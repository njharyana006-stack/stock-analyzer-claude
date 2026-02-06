import React from 'react';
import type { PricePrediction } from '../types';
import ForecastScenarios from './ForecastScenarios';

interface AIPricePredictionProps {
    prediction: PricePrediction;
    currentPrice: number;
}

const AIPricePrediction: React.FC<AIPricePredictionProps> = ({ prediction, currentPrice }) => {
    return (
        <div className="space-y-6">
            <ForecastScenarios prediction={prediction} currentPrice={currentPrice} />
        </div>
    );
};

export default AIPricePrediction;