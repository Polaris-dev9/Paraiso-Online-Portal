import React from 'react';
import { CloudSun, BarChart, ArrowDown, ArrowUp, DollarSign, Euro, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TickerItem = ({ name, value, change, icon: Icon }) => (
  <div className="flex items-center text-sm font-medium text-white px-4 flex-shrink-0">
      <Icon size={18} className="mr-2"/>
      <span>{name}</span>
      <span className="ml-2 text-gray-300">{value}</span>
      <span className={`ml-1.5 flex items-center ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      </span>
  </div>
);

const Ticker = () => {
  return (
    <section className="bg-gray-800/90 backdrop-blur-sm text-white py-3 overflow-hidden">
       <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee-slow flex">
                <TickerItem name="Dólar" value="R$5,45" change={1} icon={DollarSign} />
                <TickerItem name="Euro" value="R$6,02" change={-1} icon={Euro} />
                <TickerItem name="Bitcoin" value="R$345K" change={1} icon={Bitcoin} />
                <TickerItem name="S.J. Paraíso" value="28°C" change={1} icon={CloudSun} />
                <TickerItem name="Dólar" value="R$5,45" change={1} icon={DollarSign} />
                <TickerItem name="Euro" value="R$6,02" change={-1} icon={Euro} />
                <TickerItem name="Bitcoin" value="R$345K" change={1} icon={Bitcoin} />
                <TickerItem name="S.J. Paraíso" value="28°C" change={1} icon={CloudSun} />
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0 ml-4 bg-black/20 p-1 rounded-lg">
              <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10 text-xs">
                <Link to={{ pathname: "/informacoes", search: "?tab=quotes" }}>
                    <BarChart size={14} className="mr-1"/> Cotações
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10 text-xs">
                <Link to={{ pathname: "/informacoes", search: "?tab=weather" }}>
                    <CloudSun size={14} className="mr-1"/> Clima
                </Link>
              </Button>
          </div>
       </div>
    </section>
  );
};

export default Ticker;