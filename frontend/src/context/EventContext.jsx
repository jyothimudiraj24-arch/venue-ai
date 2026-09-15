import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const EventContext = createContext();

const initialEventState = {
  event_type: 'Wedding',
  event_date: '2026-11-20',
  city: 'Hyderabad',
  area: 'Gachibowli / Banjara Hills',
  guests: 200,
  budget: 150000,
  organizer_type: 'Family',
  priorities: ['Family Friendly', 'Accessibility', 'Low Budget'],
  age_groups: ['Kids', 'Adults', 'Senior Citizens'],
  kids_count: 25,
  facilities: ['Parking', 'Catering', 'Stage', 'Wheelchair Accessibility'],
  additional_preferences: 'Grand floral stage, sound-dampened senior seating pods, safe soft-play kids area.',
};

export const EventProvider = ({ children }) => {
  const [eventData, setEventData] = useState(() => {
    const cached = localStorage.getItem('smartvenue_event_data');
    return cached ? JSON.parse(cached) : initialEventState;
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [agentResponse, setAgentResponse] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [compareVenueIds, setCompareVenueIds] = useState([1, 2]);
  const [savedVenues, setSavedVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('smartvenue_event_data', JSON.stringify(eventData));
  }, [eventData]);

  // Load saved venues on mount
  useEffect(() => {
    fetchSavedVenues();
  }, []);

  const fetchSavedVenues = async () => {
    try {
      const data = await api.getSavedVenues();
      setSavedVenues(data);
    } catch (err) {
      console.warn('Could not fetch saved venues:', err);
    }
  };

  const updateEventData = (fields) => {
    setEventData((prev) => ({ ...prev, ...fields }));
  };

  const togglePriority = (priority) => {
    setEventData((prev) => {
      const exists = prev.priorities.includes(priority);
      return {
        ...prev,
        priorities: exists
          ? prev.priorities.filter((p) => p !== priority)
          : [...prev.priorities, priority],
      };
    });
  };

  const toggleAgeGroup = (group) => {
    setEventData((prev) => {
      const exists = prev.age_groups.includes(group);
      return {
        ...prev,
        age_groups: exists
          ? prev.age_groups.filter((g) => g !== group)
          : [...prev.age_groups, group],
      };
    });
  };

  const toggleFacility = (facility) => {
    setEventData((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const toggleCompareVenue = (venueId) => {
    setCompareVenueIds((prev) => {
      if (prev.includes(venueId)) {
        return prev.filter((id) => id !== venueId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 venues at a time.');
          return prev;
        }
        return [...prev, venueId];
      }
    });
  };

  const toggleSaveVenue = async (venueId) => {
    const isSaved = savedVenues.some((item) => item.venue_id === venueId);
    try {
      if (isSaved) {
        await api.removeSavedVenue(venueId);
      } else {
        await api.saveVenue(venueId);
      }
      await fetchSavedVenues();
    } catch (err) {
      console.error('Error toggling save status:', err);
    }
  };

  const isVenueSaved = (venueId) => {
    return savedVenues.some((item) => item.venue_id === venueId);
  };

  const resetToDemoDefaults = () => {
    setEventData(initialEventState);
    setAnalysisResult(null);
    setAgentResponse(null);
    setSelectedVenue(null);
    setCompareVenueIds([1, 2]);
  };

  return (
    <EventContext.Provider
      value={{
        eventData,
        updateEventData,
        togglePriority,
        toggleAgeGroup,
        toggleFacility,
        analysisResult,
        setAnalysisResult,
        agentResponse,
        setAgentResponse,
        selectedVenue,
        setSelectedVenue,
        compareVenueIds,
        setCompareVenueIds,
        toggleCompareVenue,
        savedVenues,
        fetchSavedVenues,
        toggleSaveVenue,
        isVenueSaved,
        resetToDemoDefaults,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
