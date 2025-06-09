import Head from 'next/head';
import React from 'react';

const HeadComponent: React.FC = () => {
    return (
        <Head>
            <title>AI Japanese Learning</title>
            <meta name="description" content="Master Japanese with intelligent AI questions and interactive quizzes. Improve your vocabulary, grammar, and comprehension with personalized learning." />
            <link rel="icon" href="/favicon.ico" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://ai-language-learning-eta.vercel.app/" />
            <meta property="og:title" content="AI Japanese Learning - Master Japanese with AI Quizzes" />
            <meta property="og:description" content="Improve your Japanese skills with AI-generated questions tailored to your level. Interactive quizzes for vocabulary, grammar, and comprehension." />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://ai-language-learning-eta.vercel.app/" />
            <meta property="twitter:title" content="AI Japanese Learning - Master Japanese with AI Quizzes" />
            <meta property="twitter:description" content="Improve your Japanese skills with AI-generated questions tailored to your level. Interactive quizzes for vocabulary, grammar, and comprehension." />
        </Head>
    );
};

export default HeadComponent;
