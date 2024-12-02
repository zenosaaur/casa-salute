
// HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex fixed top-0 flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="mb-2 text-4xl text-gray-700 font-bold">Elaborato Ingegneria del</p>
        <p className="mb-2 text-4xl text-gray-700 font-bold">Software</p>
        <p className="mb-7 text-xl text-gray-700">2023/2024</p>
        <p className="mb-2 text-xl text-gray-700 font-bold">Betti Stefano e Zeni Davide</p>
        <p className="mb-7 text-lg text-gray-700 font-bold">VR474135 - VR486320</p>
        <p className="mb-2 text-lg text-gray-700">Università di Verona — Informatica</p>
        <p className="text-lg text-gray-700">16/07/2024</p>
        <Link to="/login">
          <button className="mt-6 px-4 py-2 bg-[#e4335a] text-white rounded">
            Vai al login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
