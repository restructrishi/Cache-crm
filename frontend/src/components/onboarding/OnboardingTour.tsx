import React, { useState, useEffect } from 'react';
import ReactJoyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const TOUR_STEPS: Step[] = [
    {
        target: 'body',
        content: (
            <div className="text-center">
                <h2 className="font-bold text-xl mb-2">Welcome to Cache CRM</h2>
                <p>Let's show you around your new luxury workspace.</p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '[data-tour="nav-leads"]',
        content: 'Manage your incoming Leads here. Convert them to Deals with one click.',
        placement: 'right',
    },
    {
        target: '[data-tour="nav-meetings"]',
        content: 'Schedule Meetings and MANDATORY MoM (Minutes of Meeting). You cannot close a deal without MoMs.',
        placement: 'right',
    },
    {
        target: '[data-tour="nav-quotes"]',
        content: 'Create BOQs and Versioned Quotes for your clients.',
        placement: 'right',
    },
    {
        target: '[data-tour="nav-orders"]',
        content: 'Track Customer POs and internal Vendor POs for Supply Chain.',
        placement: 'right',
    },
    {
        target: '[data-tour="nav-tickets"]',
        content: 'Raise support tickets. They escalate to Org Admin, then Super Admin if unresolved.',
        placement: 'right',
    },
    {
        target: '[data-tour="header-search"]',
        content: 'Quick Search your entire record base from here.',
        placement: 'bottom',
    }
];

export const OnboardingTour: React.FC = () => {
    const [run, setRun] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Only run on Dashboard for now, and if not visited before
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        const validPaths = ['/app', '/admin'];
        if (!hasSeenTour && validPaths.includes(location.pathname)) {
            setRun(true);
        }
    }, [location]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        
        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('hasSeenTour', 'true');
        }
    };

    return (
        <ReactJoyride
            steps={TOUR_STEPS}
            run={run}
            continuous
            showSkipButton
            showProgress
            styles={{
                options: {
                    primaryColor: '#2563eb', // Blue-600
                    zIndex: 1000,
                },
                tooltipContainer: {
                    textAlign: 'left'
                },
                buttonNext: {
                    backgroundColor: '#2563eb',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: 600
                },
                buttonBack: {
                    color: '#64748b'
                }
            }}
            callback={handleJoyrideCallback}
        />
    );
};
