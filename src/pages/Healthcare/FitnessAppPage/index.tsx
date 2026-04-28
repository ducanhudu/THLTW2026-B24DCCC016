import React, { useState } from 'react';
import { Segmented } from 'antd';
import WorkoutLog from '../WorkoutLog';
import WorkoutDashboard from '../WorkoutDashboard';
import HealthMetrics from '../HealthMetrics';
import Goals from '../Goals';
import ExerciseLibrary from '../ExerciseLibrary';

const SECTIONS = ['Workout Log', 'Workout Dashboard', 'Health Metrics', 'Goals', 'Exercise Library'];

const FitnessAppPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('Workout Log');

    const renderSection = () => {
        switch (activeSection) {
            case 'Workout Log':
                return <WorkoutLog />;
            case 'Workout Dashboard':
                return <WorkoutDashboard />;
            case 'Health Metrics':
                return <HealthMetrics />;
            case 'Goals':
                return <Goals />;
            case 'Exercise Library':
                return <ExerciseLibrary />;
            default:
                return <WorkoutLog />;
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }} className='healthcare-segmented'>
                <style>{`
                    .healthcare-segmented .ant-segmented-item-selected {
                        background: var(--primary-color, #CC0D00) !important;
                        color: #fff !important;
                        font-weight: 600;
                    }
                `}</style>
                <Segmented
                    options={SECTIONS}
                    value={activeSection}
                    onChange={(value) => setActiveSection(value as string)}
                    size='large'
                />
            </div>
            <div>
                {renderSection()}
            </div>
        </div>
    );
};

export default FitnessAppPage;