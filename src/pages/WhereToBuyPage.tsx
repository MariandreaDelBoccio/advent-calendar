import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Store, Navigation, Phone, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StoreLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

// Datos de ejemplo de supermercados
const STORES: StoreLocation[] = [
  {
    id: 1,
    name: 'Supermercado Central',
    address: 'Calle Principal 123',
    city: 'Madrid',
    phone: '+34 912 345 678',
    hours: 'L-D: 9:00 - 22:00',
    lat: 40.4168,
    lng: -3.7038,
  },
  {
    id: 2,
    name: 'Hipermercado Norte',
    address: 'Avenida del Norte 456',
    city: 'Madrid',
    phone: '+34 912 345 679',
    hours: 'L-D: 8:00 - 23:00',
    lat: 40.4500,
    lng: -3.6900,
  },
  {
    id: 3,
    name: 'Mercado del Sur',
    address: 'Plaza del Sur 789',
    city: 'Madrid',
    phone: '+34 912 345 680',
    hours: 'L-S: 9:00 - 21:00',
    lat: 40.3900,
    lng: -3.7100,
  },
  {
    id: 4,
    name: 'Supermercado Este',
    address: 'Calle del Este 321',
    city: 'Madrid',
    phone: '+34 912 345 681',
    hours: 'L-D: 9:00 - 22:00',
    lat: 40.4200,
    lng: -3.6700,
  },
  {
    id: 5,
    name: 'Hipermercado Oeste',
    address: 'Avenida del Oeste 654',
    city: 'Madrid',
    phone: '+34 912 345 682',
    hours: 'L-D: 8:00 - 23:00',
    lat: 40.4100,
    lng: -3.7300,
  },
];

export const WhereToBuyPage = () => {
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Intentar obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('No se pudo obtener la ubicación:', error);
        }
      );
    }
  }, []);

  const defaultCenter: [number, number] = [40.4168, -3.7038]; // Madrid

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <MapPin size={48} className="text-primary-300" />
          <h1 className="text-4xl md:text-5xl font-bold text-shadow">
            ¿Dónde Comprar?
          </h1>
        </div>
        <p className="text-xl text-white/80 mb-6">
          Encuentra tu calendario de adviento en estos supermercados
        </p>

        {/* Stats */}
        <div className="glass-effect rounded-xl px-8 py-4 inline-block">
          <div className="text-4xl font-bold text-primary-300">{STORES.length}</div>
          <div className="text-sm text-white/70">Tiendas Disponibles</div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de tiendas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2"
          >
            {STORES.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => setSelectedStore(store)}
                className={`
                  glass-effect rounded-xl p-4 cursor-pointer transition-all
                  ${selectedStore?.id === store.id ? 'ring-2 ring-primary-400 bg-white/20' : 'hover:bg-white/10'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Store size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1">{store.name}</h3>
                    <p className="text-sm text-white/70 mb-2">{store.address}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Phone size={12} />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Clock size={12} />
                        <span>{store.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect rounded-2xl p-4 h-[600px]">
              <MapContainer
                center={userLocation || defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Marcadores de tiendas */}
                {STORES.map((store) => (
                  <Marker
                    key={store.id}
                    position={[store.lat, store.lng]}
                    eventHandlers={{
                      click: () => setSelectedStore(store),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">{store.name}</h3>
                        <p className="text-sm mb-2">{store.address}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <Phone size={12} />
                            <span>{store.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={12} />
                            <span>{store.hours}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Marcador de ubicación del usuario */}
                {userLocation && (
                  <Marker position={userLocation}>
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold">Tu ubicación</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </motion.div>
        </div>

        {/* Info adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Navigation className="text-primary-300" size={28} />
            <h2 className="text-2xl font-bold">Cómo Llegar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
            <div>
              <h3 className="font-semibold mb-2">💡 Consejos:</h3>
              <ul className="space-y-1">
                <li>• Haz click en una tienda para ver más detalles</li>
                <li>• Los marcadores en el mapa muestran cada ubicación</li>
                <li>• Llama antes de ir para confirmar disponibilidad</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎁 Disponibilidad:</h3>
              <ul className="space-y-1">
                <li>• Calendarios disponibles desde noviembre</li>
                <li>• Stock limitado - ¡No esperes hasta diciembre!</li>
                <li>• Pregunta por promociones especiales</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
