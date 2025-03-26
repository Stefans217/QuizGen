import React from 'react';


const Help: React.FC = () => {
  return (
<div className="min-h-screen p-6 bg-gray-50">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Help &amp; How-To</h1>
        <p className="text-lg text-gray-700 mt-2">Creating and Importing Canvas Quizzes</p>
      </header>
      <main className="max-w-3xl mx-auto">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Step 1: Create a New Quiz</h2>
          <p className="mb-2"><strong>Navigate to:</strong> <span className="text-blue-600">quizzes -&gt; new quiz</span></p>
          <p className="text-gray-700">
            Click on <em>new quiz</em> to start the quiz creation process.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Step 2: Enter Quiz Details</h2>
          <p className="mb-2"><strong>Navigate to:</strong> <span className="text-blue-600">quiz details</span></p>
          <p className="text-gray-700">
            Fill in the necessary details, such as title, description, and settings.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Step 3: Build Your Quiz</h2>
          <p className="mb-2"><strong>Navigate to:</strong> <span className="text-blue-600">build</span></p>
          <p className="text-gray-700">
            Use the build feature to add questions and configure quiz logic.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Step 4: Import Content</h2>
          <p className="mb-2">
            <strong>Locate the Import Option:</strong> Upper right corner (three dots)
          </p>
          <p className="text-gray-700">
            Click on the three dots and select <em>import content</em> to open the import dialog.
          </p>
          <p className="mb-2">
            <strong>How to Import:</strong> Select your zip folder or drag and drop it into the designated area.
          </p>
        </section>
        <footer className="text-center mt-8">
          <p className="text-gray-600"></p>
        </footer>
      </main>
    </div>
  );
};


export default Help;