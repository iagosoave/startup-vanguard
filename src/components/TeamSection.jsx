import React from 'react';
import Rafa from './Rafa.png';
import Iago from './Iago.png';
import Nunes from './Nunes.png';
import Hugo from './Hugo.png';
import Carlos from './Carlos.png';
import Luiz from './Luiz.png';
import Joao from './Joao.png';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Rafael Samarra",
      roles: ["Analista de BI", "Gestor do Projeto", "Product Owner (PO)"],
      image: Rafa
    },
    {
      name: "Iago Soave",
      roles: ["Desenvolvedor FullStack", "Engenheiro de Testes"],
      image: Iago
    },
    {
      name: "Lucas Nunes",
      roles: ["Analista de Viabilidade", "Designer"],
      image: Nunes
    },
    {
      name: "Hugo Castro",
      roles: ["Analista de Requisitos", "Scrum Master"],
      image: Hugo
    },
    {
      name: "Luiz Henrique",
      roles: ["Desenvolvedor Back-end", "Especialista em Deploy"],
      image: Luiz
    },
    {
      name: "João Eduardo",
      roles: ["Consultor de Usabilidade", "Desenvolvedor Front-end", "Engenheiro de Testes"],
      image: Joao
    }
  ];

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden py-20">
      <div className="absolute top-0 left-0 w-1 h-32 bg-red-600"></div>
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-red-600"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-8 z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-16 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-red-600"></div>
            </div>
            <h2 className="text-lg sm:text-xl uppercase tracking-widest mb-6 font-light text-gray-700">
              Conheça nossa
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-8">
              EQUIPE<br />
              <span className="text-red-600">DESENVOLVEDORA</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Profissionais dedicados que tornaram o autoFácil uma realidade.<br />
              Cada um contribuindo com sua expertise única.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-100 group-hover:border-red-600 transition-colors duration-300">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center" style={{display: 'none'}}>
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {member.name}
                </h3>
                
                <div className="space-y-1">
                  {member.roles.map((role, roleIndex) => (
                    <p key={roleIndex} className="text-sm text-gray-600 font-medium tracking-wide">
                      {role}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 w-full text-center z-20">
        <div className="flex items-center justify-center">
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mx-4">
            Desenvolvido com dedicação
          </p>
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
