import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ExternalLinkIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const Monitoring = () => {
  const [activeTab, setActiveTab] = useState('grafana');

  const monitoringTools = [
    {
      id: 'grafana',
      name: 'Grafana',
      description: 'Tableaux de bord et visualisations',
      url: 'http://localhost:3000',
      color: 'bg-orange-500',
      icon: '📊'
    },
    {
      id: 'locust',
      name: 'Locust',
      description: 'Interface de test de charge',
      url: 'http://localhost:8089',
      color: 'bg-green-500',
      icon: '🦗'
    },
    {
      id: 'prometheus',
      name: 'Prometheus',
      description: 'Métriques et monitoring',
      url: 'http://localhost:9090',
      color: 'bg-red-500',
      icon: '🔥'
    }
  ];

  const activeTool = monitoringTools.find(tool => tool.id === activeTab);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Monitoring</h2>
        <p className="text-gray-600 mt-1">
          Surveillez vos tests en temps réel avec les outils intégrés
        </p>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {monitoringTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTab(tool.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === tool.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tool.icon}</span>
            <span>{tool.name}</span>
          </button>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="card p-0 overflow-hidden">
        {/* Barre d'outils */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${activeTool.color}`}></div>
            <div>
              <h3 className="font-medium text-gray-900">{activeTool.name}</h3>
              <p className="text-sm text-gray-500">{activeTool.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Actualiser"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
            
            <a
              href={activeTool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              <span>Ouvrir dans un nouvel onglet</span>
            </a>
          </div>
        </div>

        {/* iFrame */}
        <div className="relative" style={{ height: '600px' }}>
          <iframe
            src={activeTool.url}
            className="w-full h-full border-0"
            title={`${activeTool.name} Dashboard`}
            onError={() => {
              console.error(`Erreur chargement ${activeTool.name}`);
            }}
          />
          
          {/* Overlay de chargement */}
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de {activeTool.name}...</p>
              <p className="text-sm text-gray-500 mt-2">
                Assurez-vous que le service est démarré sur {activeTool.url}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {monitoringTools.map((tool) => (
          <div key={tool.id} className="card">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center text-white text-sm`}>
                {tool.icon}
              </div>
              <h4 className="font-medium text-gray-900">{tool.name}</h4>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
            
            <div className="text-xs text-gray-500">
              {tool.id === 'grafana' && (
                <ul className="space-y-1">
                  <li>• Tableaux de bord personnalisables</li>
                  <li>• Métriques en temps réel</li>
                  <li>• Alertes configurables</li>
                </ul>
              )}
              
              {tool.id === 'locust' && (
                <ul className="space-y-1">
                  <li>• Contrôle des tests en cours</li>
                  <li>• Statistiques détaillées</li>
                  <li>• Graphiques de performance</li>
                </ul>
              )}
              
              {tool.id === 'prometheus' && (
                <ul className="space-y-1">
                  <li>• Métriques système</li>
                  <li>• Requêtes PromQL</li>
                  <li>• Exploration des données</li>
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monitoring;