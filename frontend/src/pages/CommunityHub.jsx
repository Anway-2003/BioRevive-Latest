import  { useState } from 'react';

import { Heart, MessageSquare, Plus, Search, Bell } from 'lucide-react';

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock community activities data
  const activities = [
    {
      id: 1,
      club: 'Green Warriors Club',
      action: 'Adopted Wagholi Dumping Ground. We are starting the soil remediation process this weekend. Who wants to join?',
      time: '3 hours ago',
      likes: 12,
      comments: 3,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      club: 'Pune Eco Club',
      action: 'Planted 25 native trees at Hinjewadi IT Park. The soil moisture levels are looking great after the initial prep!',
      time: '1 day ago',
      likes: 18,
      comments: 5,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      club: 'Save Earth Foundation',
      action: 'Completed soil remediation at Mula Riverside. Testing shows a 40% reduction in chemical pollutants. Nature is healing!',
      time: '2 days ago',
      likes: 20,
      comments: 4,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
        
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Community</h1>
            <p className="text-[11px] font-bold text-gray-500">Connect & Collaborate</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="bg-white px-4 shadow-sm border-b border-gray-100 flex gap-4 overflow-x-auto custom-scrollbar sticky top-[68px] z-10">
          {[
            { id: 'all', label: 'Feed' },
            { id: 'my_activities', label: 'My Posts' },
            { id: 'my_group', label: 'My Teams' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-extrabold whitespace-nowrap border-b-[3px] transition-all ${
                activeTab === tab.id
                  ? 'border-[#114A29] text-[#114A29]'
                  : 'border-transparent text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Feed */}
        <div className="p-4 space-y-4">
          {activities.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              {/* User Info */}
              <div className="flex gap-3 items-center mb-3">
                <img src={item.avatar} alt={item.club} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-50" />
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">{item.club}</h3>
                  <p className="text-[10px] text-gray-400 font-bold">{item.time}</p>
                </div>
              </div>
              
              {/* Post Content */}
              <p className="text-sm font-medium text-gray-700 mb-4 leading-relaxed">
                {item.action}
              </p>
              
              {/* Interactions */}
              <div className="flex items-center gap-6 border-t border-gray-50 pt-3">
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 transition">
                  <Heart size={16} className="text-red-500 fill-red-500" /> {item.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition">
                  <MessageSquare size={16} /> {item.comments}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Button (FAB) for Mobile */}
        <button className="fixed bottom-[85px] right-5 bg-[#114A29] text-white p-4 rounded-full shadow-xl hover:bg-green-800 transition active:scale-90 z-30 flex items-center justify-center">
          <Plus size={24} />
        </button>

      </div>


      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Juna Code - hidden md:block) */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Community Hub</h1>
            <p className="text-xs font-bold text-gray-400">Connect. Collaborate. Create Impact.</p>
          </div>

          {/* Tabs Filter */}
          <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100 max-w-md">
            {[
              { id: 'all', label: 'All Activities' },
              { id: 'my_activities', label: 'My Activities' },
              { id: 'my_group', label: 'My Group' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activity Feed List */}
          <div className="space-y-4 mb-8">
            {activities.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-gray-100 hover:bg-gray-50/50 transition flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.avatar} alt={item.club} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-sm mb-0.5">{item.club}</h3>
                    <p className="text-xs font-medium text-gray-600 mb-1">{item.action}</p>
                    <span className="text-[11px] font-bold text-gray-400">{item.time}</span>
                  </div>
                </div>

                {/* Likes & Comments Stats */}
                <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-gray-400" />
                    <span>{item.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create New Post Button */}
          <button className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2">
            <Plus size={18} /> Create New Post
          </button>

        </div>
      </div>

    </div>
  );
};

export default CommunityHub;