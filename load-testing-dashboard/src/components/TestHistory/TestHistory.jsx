import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  ChartBarIcon, 
  ExternalLinkIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { testService } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import { cn } from '../../utils/cn';

const TestHistory = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      setLoading(true);
      const history = await testService.getTestHistory();
      setTests(history);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Terminé', class: 'badge-success' },
      running: { label: 'En cours', class: 'badge-info' },
      stopped: { label: 'Arrêté', class: 'badge-warning' },
      failed: { label: 'Échec', class: 'badge-error' }
    };

    const config = statusConfig[status] || { label: status, class: 'badge-gray' };
    return <span className={cn('badge', config.class)}>{config.label}</span>;
  };

  const formatDuration = (startTime, endTime) => {
    if (!startTime) return '-';
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const durationMs = end - start;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const openInGrafana = (test) => {
    if (!test.start_time) return;
    
    const startTime = new Date(test.start_time).getTime();
    const endTime = test.end_time ? new Date(test.end_time).getTime() : Date.now();
    
    const grafanaUrl = `http://localhost:3000/d/locust-dashboard?from=${startTime}&to=${endTime}`;
    window.open(grafanaUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historique des Tests</h2>
          <p className="text-gray-600 mt-1">
            Consultez les résultats de vos tests précédents
          </p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600">Chargement de l'historique...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historique des Tests</h2>
          <p className="text-gray-600 mt-1">
            Consultez les résultats de vos tests précédents
          </p>
        </div>
        
        <button
          onClick={loadTestHistory}
          className="btn-outline"
        >
          Actualiser
        </button>
      </div>

      {/* Liste des tests */}
      {tests.length === 0 ? (
        <div className="card text-center py-12">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun test dans l'historique
          </h3>
          <p className="text-gray-500">
            Les tests que vous lancerez apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="card p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {test.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {test.users} utilisateurs • {test.target_url}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(test.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {test.start_time ? 
                        format(new Date(test.start_time), 'dd MMM yyyy HH:mm', { locale: fr }) : 
                        '-'
                      }
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(test.start_time, test.end_time)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {test.avg_response_time ? (
                          <div className="space-y-1">
                            <div>Temps: {Math.round(test.avg_response_time)}ms</div>
                            <div>RPS: {test.requests_per_second?.toFixed(1) || 0}</div>
                            <div>Erreurs: {test.error_rate?.toFixed(1) || 0}%</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedTest(test)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Voir les détails"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => openInGrafana(test)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ouvrir dans Grafana"
                        >
                          <ChartBarIcon className="h-4 w-4" />
                        </button>
                        
                        <a
                          href="http://localhost:8089"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                          title="Ouvrir Locust"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal détails test */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails du test: {selectedTest.name}
                </h3>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">URL cible</p>
                  <p className="font-medium">{selectedTest.target_url}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Utilisateurs</p>
                  <p className="font-medium">{selectedTest.users}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Vitesse d'apparition</p>
                  <p className="font-medium">{selectedTest.spawn_rate}/s</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Durée configurée</p>
                  <p className="font-medium">
                    {selectedTest.duration === 0 ? 'Illimitée' : `${selectedTest.duration}s`}
                  </p>
                </div>
                
                {selectedTest.total_requests && (
                  <>
                    <div>
                      <p className="text-gray-500">Total requêtes</p>
                      <p className="font-medium">{selectedTest.total_requests.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Temps de réponse moyen</p>
                      <p className="font-medium">{Math.round(selectedTest.avg_response_time)}ms</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => openInGrafana(selectedTest)}
                  className="btn-primary"
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Ouvrir dans Grafana
                </button>
                
                <button
                  onClick={() => setSelectedTest(null)}
                  className="btn-outline"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHistory;