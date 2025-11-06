import React from 'react';

interface OfflineBannerProps {
  lastUpdated?: string | null;
}

const timeAgo = (dateString: string | null): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "à l'instant";
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }

  const days = Math.round(hours / 24);
  if (days < 30) {
     return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
  
  const months = Math.round(days / 30);
  if (months < 12) {
    return `il y a ${months} mois`;
  }

  const years = Math.round(months / 12);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
};


const OfflineBanner: React.FC<OfflineBannerProps> = ({ lastUpdated }) => {
  const lastUpdatedMessage = lastUpdated 
    ? `Dernière mise à jour : ${timeAgo(lastUpdated)}.`
    : 'Les données peuvent ne pas être à jour.';

  return (
    <div className="bg-amber-500 text-center p-2 text-sm text-black font-semibold">
      <i className="fa-solid fa-wifi-slash mr-2"></i>
      <span>Vous êtes hors ligne. {lastUpdatedMessage}</span>
    </div>
  );
};

export default OfflineBanner;
