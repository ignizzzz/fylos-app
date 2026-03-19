# HOME SCREEN (Editable Extract)

Use this as a copy/edit version of the current Home implementation.

- Source: `src/screens/06_PETS_ProfileShell_Documents_v1.jsx`
- Section: from `// --- DASHBOARD HOME SCREEN ---` up to just before `const ServicesScreen = ...`
- Paste-back target: replace the same section in `06_PETS_ProfileShell_Documents_v1.jsx`

```jsx
// --- DASHBOARD HOME SCREEN ---
const useTimeBasedGreeting = () => { const h = new Date().getHours(); if (h < 12) return 'Good morning'; if (h < 18) return 'Good afternoon'; return 'Good evening'; };
const formatDateTime = (iso) => { const d = new Date(iso); return `${d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })} · ${d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false })}`; };

const getDaysUntilDate = (dateValue) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(dateValue);
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  return Math.ceil((target.getTime() - today.getTime()) / msPerDay);
};

const useHealthAlerts = (petId, enabled = true) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!enabled) {
      setAlerts([]);
      return;
    }

    try {
      const nextAlerts = [];
      const now = Date.now();

      MOCK_HEALTH_DATA.vaccinations.forEach((vaccination) => {
        const daysUntilDue = getDaysUntilDate(vaccination.nextDate);
        if (daysUntilDue < 0) {
          nextAlerts.push({
            id: `health_vaccination_overdue_${vaccination.id}_${petId}`,
            priority: 'critical',
            type: 'vaccination',
            title: 'Vaccination Overdue',
            message: `${vaccination.name} expired ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? '' : 's'} ago`,
            actionLabel: 'Open Health Records',
            actionRoute: '/vault/health',
            petId
          });
        } else if (daysUntilDue <= 7) {
          nextAlerts.push({
            id: `health_vaccination_soon_${vaccination.id}_${petId}`,
            priority: 'high',
            type: 'vaccination',
            title: 'Vaccination Due Soon',
            message: `${vaccination.name} is due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`,
            actionLabel: 'Review Schedule',
            actionRoute: '/vault/health',
            petId
          });
        }
      });

      MOCK_HEALTH_DATA.medications
        .filter((medication) => medication.isActive)
        .forEach((medication) => {
          if (medication.nextDoseTime === 'Today') {
            nextAlerts.push({
              id: `health_medication_today_${medication.id}_${petId}`,
              priority: 'high',
              type: 'medication',
              title: 'Medication Due Today',
              message: `${medication.name} should be given today`,
              actionLabel: 'View Medication',
              actionRoute: '/vault/health',
              petId
            });
            return;
          }

          if (medication.nextDose) {
            const nextDoseDate = new Date(medication.nextDose).getTime();
            if (!Number.isNaN(nextDoseDate) && nextDoseDate < now) {
              nextAlerts.push({
                id: `health_medication_overdue_${medication.id}_${petId}`,
                priority: 'critical',
                type: 'medication',
                title: 'Medication Overdue',
                message: `${medication.name} dose is overdue`,
                actionLabel: 'Open Health Records',
                actionRoute: '/vault/health',
                petId
              });
            }
          }
        });

      const sortedAlerts = nextAlerts.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority === 'critical' ? -1 : 1;
        return a.title.localeCompare(b.title);
      });
      setAlerts(sortedAlerts);
    } catch (error) {
      console.error('Failed to fetch health alerts:', error);
      setAlerts([]);
    }
  }, [petId, enabled]);

  return alerts;
};

const useLaunchingFeature = () => {
  return UPCOMING_FEATURES
    .map((feature) => ({ ...feature, daysUntilLaunch: getDaysUntilDate(feature.launchDate) }))
    .filter((feature) => feature.daysUntilLaunch >= 0 && feature.daysUntilLaunch <= 14)
    .sort((a, b) => a.daysUntilLaunch - b.daysUntilLaunch)[0] || null;
};

const HealthAlertBanner = React.memo(({ alert, onDismiss, onAction }) => {
  if (!alert) return null;
  const isCritical = alert.priority === 'critical';
  const Icon = isCritical ? AlertTriangle : Clock3;
  const styles = isCritical
    ? {
        container: 'bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]',
        subtitle: 'text-[#991B1B]/90'
      }
    : {
        container: 'bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]',
        subtitle: 'text-[#92400E]/90'
      };

  return (
    <div
      className={`relative min-h-[100px] p-4 rounded-[16px] border mb-4 ${styles.container}`}
      role="alert"
      aria-label={`${alert.priority} priority: ${alert.title}`}
    >
      <button
        onClick={onDismiss}
        className="absolute top-1 right-1 w-11 h-11 rounded-full flex items-center justify-center active:opacity-70"
        aria-label="Dismiss health alert"
      >
        <X size={18} />
      </button>
      <div className="pr-11">
        <div className="flex items-start gap-3 mb-2">
          <Icon size={24} className="shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-semibold leading-tight">{alert.title}</h3>
            <p className={`text-[14px] leading-snug mt-1 ${styles.subtitle}`}>{alert.message}</p>
          </div>
        </div>
        <div className="pt-2">
          <Button
            variant="primary"
            size="small"
            fullWidth={false}
            onClick={onAction}
            aria-label={alert.actionLabel}
            aria-description={`Opens ${alert.type} details`}
          >
            {alert.actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
});

const LaunchBanner = React.memo(({ feature, daysUntilLaunch, onDismiss, onJoinWaitlist, onLearnMore, joined }) => {
  if (!feature) return null;
  const FeatureIcon = feature.icon || Rocket;
  return (
    <div
      className="relative min-h-[140px] p-5 rounded-[16px] mb-4 text-white border border-[#E55A28]/40 shadow-[0_8px_24px_rgba(229,90,40,0.26)]"
      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E55A28 100%)' }}
      role="button"
      aria-label={`${feature.title} launching in ${daysUntilLaunch} days`}
    >
      <button
        onClick={onDismiss}
        className="absolute top-1 right-1 w-11 h-11 rounded-full flex items-center justify-center text-white/95 active:opacity-70"
        aria-label="Dismiss launch banner"
      >
        <X size={18} />
      </button>
      <div className="pr-11">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            <FeatureIcon size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[20px] font-bold leading-tight">{feature.title}</h3>
            <p className="text-[14px] text-white/90 mt-1">{feature.description || feature.tagline}</p>
            <p className="text-[16px] font-semibold mt-2">Launching in {daysUntilLaunch} days</p>
          </div>
        </div>
        <div className="flex gap-2.5 pt-4">
          <Button
            variant="secondary"
            size="small"
            fullWidth={false}
            onClick={onJoinWaitlist}
            className="!bg-white !text-[#E55A28] !border-white"
            aria-label="Join waitlist"
            aria-description="Opens waitlist signup form"
          >
            {joined ? 'Joined' : 'Join Waitlist'}
          </Button>
          <Button
            variant="secondary"
            size="small"
            fullWidth={false}
            onClick={onLearnMore}
            className="!bg-white/15 !text-white !border-white/35"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
});

const HomeScreen = ({ onNavigate, notifications = [], onOpenInbox, onOpenHealthRecords, onOpenComingSoon, onToggleWaitlist, joinedWaitlists = new Set() }) => {
  const [selectedPetId, setSelectedPetId] = useState(MOCK_DASHBOARD_PETS[0].id);
  const [medSheetOpen, setMedSheetOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [completedReminders, setCompletedReminders] = useState(new Set());
  const [isFading, setIsFading] = useState(false);
  const [displayPetId, setDisplayPetId] = useState(MOCK_DASHBOARD_PETS[0].id);
  const [dismissedHealthAlerts, setDismissedHealthAlerts] = useState(new Set());
  const [dismissedLaunchBanner, setDismissedLaunchBanner] = useState(false);
  const dismissTimeoutRef = useRef(null);
  const greeting = useTimeBasedGreeting();
  const selectedPet = MOCK_DASHBOARD_PETS.find(p => p.id === displayPetId) || MOCK_DASHBOARD_PETS[0];
  const healthAlerts = useHealthAlerts(displayPetId, true);
  const launchingFeature = useLaunchingFeature();
  const launchDaysLeft = launchingFeature ? getDaysUntilDate(launchingFeature.launchDate) : null;
  const launchDismissKey = launchingFeature ? `dismissed_banner_${launchingFeature.id}` : null;
  const visibleHealthAlert = healthAlerts.find((alert) => !dismissedHealthAlerts.has(alert.id));
  const handlePetSelect = (id) => { if (id === selectedPetId) return; setSelectedPetId(id); setIsFading(true); setTimeout(() => { setDisplayPetId(id); setIsFading(false); }, 200); };
  const handleCompleteReminder = (id) => { setCompletedReminders(prev => { const n = new Set(prev); n.add(id); return n; }); };
  const handleDismissHealthAlert = (alertId) => {
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    dismissTimeoutRef.current = setTimeout(() => {
      setDismissedHealthAlerts((prev) => {
        const next = new Set(prev);
        next.add(alertId);
        return next;
      });
    }, 120);
  };
  const handleHealthAlertAction = () => {
    if (onOpenHealthRecords) {
      onOpenHealthRecords();
      return;
    }
    onNavigate('vault');
  };
  const handleDismissLaunchBanner = () => {
    setDismissedLaunchBanner(true);
    if (launchDismissKey) localStorage.setItem(launchDismissKey, 'true');
  };
  const handleJoinWaitlist = () => {
    if (!launchingFeature) return;
    onToggleWaitlist?.(launchingFeature.id);
  };
  const handleLearnMore = () => {
    onOpenComingSoon?.(launchingFeature?.id);
  };

  useEffect(() => {
    if (!launchDismissKey) {
      setDismissedLaunchBanner(false);
      return;
    }
    setDismissedLaunchBanner(localStorage.getItem(launchDismissKey) === 'true');
  }, [launchDismissKey]);

  useEffect(() => () => {
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
  }, []);

  const filteredBookings = MOCK_BOOKINGS.filter(b => b.petId === displayPetId);
  const filteredReminders = MOCK_REMINDERS.filter(r => r.petId === displayPetId);
  const filteredSuggestions = MOCK_SUGGESTIONS.filter(s => s.petId === displayPetId);
  const getBadgeVariant = (s) => s === 'Confirmed' ? 'success' : s === 'Pending' ? 'warning' : 'default';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalAlerts = notifications.filter((n) => !n.read && n.priority === 'critical');
  const selectedPetProfile = INITIAL_MOCK_PETS.find((pet) => pet.id === displayPetId) || INITIAL_MOCK_PETS[0];
  const homeWidgets = [
    { id: 'w-pets', label: 'Pets', value: `${MOCK_DASHBOARD_PETS.length}`, icon: PawPrint, onClick: () => onNavigate('pets') },
    { id: 'w-services', label: 'Bookings', value: `${filteredBookings.length}`, icon: Calendar, onClick: () => onNavigate('services') },
    { id: 'w-activity', label: 'Activity', value: `${MY_ACTIVITIES.length}`, icon: Activity, onClick: () => onNavigate('activity') },
    { id: 'w-vault', label: 'Docs', value: `${selectedPetProfile?.documents?.length || 0}`, icon: Folder, onClick: () => onNavigate('vault') },
    { id: 'w-inbox', label: 'Inbox', value: `${unreadCount}`, icon: Bell, onClick: onOpenInbox },
    { id: 'w-alerts', label: 'Alerts', value: `${criticalAlerts.length}`, icon: AlertTriangle, onClick: onOpenInbox }
  ];

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-6">
        <div className="pt-2"><h2 className="text-[24px] font-bold text-[#111111] mb-2">{greeting}, <span className="font-extrabold">{MOCK_USER.name}</span></h2><p className="text-[15px] text-[#6E6E73]">What's on the schedule today?</p></div>
        {MOCK_DASHBOARD_PETS.length > 1 && (
          <div className="flex overflow-x-auto hide-scrollbar -mx-5 px-5 gap-4 pb-2">
            {MOCK_DASHBOARD_PETS.map((pet) => { const isSelected = selectedPetId === pet.id; return (
              <button key={pet.id} onClick={() => handlePetSelect(pet.id)} className="flex flex-col items-center gap-2 flex-shrink-0 active:scale-[0.98]">
                <div className={`relative rounded-full p-[2px] transition-all duration-200 ${isSelected ? 'border-[2px] border-[#FF6B35]/85' : 'border border-black/[0.03] opacity-80'}`}>
                  <img src={pet.avatar} alt={pet.name} className="w-[68px] h-[68px] rounded-full object-cover border-[1.5px] border-white" />
                  {isSelected && <div className="absolute -bottom-0 -right-0 w-[18px] h-[18px] bg-white rounded-full border border-black/[0.03] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center"><CheckCircle2 size={10} color="#FF6B35" strokeWidth={3} /></div>}
                </div>
                <span className={`text-[13px] font-semibold ${isSelected ? 'text-[#111111]' : 'text-[#6E6E73]'}`}>{pet.name}</span>
              </button>
            ); })}
          </div>
        )}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#111111]">Quick Overview</h3>
            <span className="text-[11px] text-[#8E8E93] font-medium">All tabs</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {homeWidgets.map((widget) => {
              const Icon = widget.icon;
              return (
                <Card key={widget.id} clickable onClick={widget.onClick} className="!p-3 !rounded-[14px]">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center">
                      <Icon size={16} className="text-[#6E6E73]" />
                    </div>
                    <div className="text-[17px] font-bold text-[#111111] leading-none">{widget.value}</div>
                    <div className="text-[11px] font-medium text-[#8E8E93] leading-none">{widget.label}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
        {unreadCount > 0 && (
          <Card clickable className="!p-4" onClick={onOpenInbox}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-[#FF6A3D]" />
                <span className="text-[15px] font-semibold text-[#111111]">Inbox Summary</span>
              </div>
              <Badge variant="count">{unreadCount}</Badge>
            </div>
            {criticalAlerts.length > 0 && (
              <div className="mt-3 text-[13px] text-[#FF3B30] font-medium flex items-center gap-1.5">
                <AlertTriangle size={14} />
                {criticalAlerts[0].title}
              </div>
            )}
          </Card>
        )}
        <div className={`space-y-6 transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          {visibleHealthAlert && (
            <HealthAlertBanner
              alert={visibleHealthAlert}
              onDismiss={() => handleDismissHealthAlert(visibleHealthAlert.id)}
              onAction={handleHealthAlertAction}
            />
          )}
          {launchingFeature && launchDaysLeft !== null && !dismissedLaunchBanner && (
            <LaunchBanner
              feature={launchingFeature}
              daysUntilLaunch={launchDaysLeft}
              joined={joinedWaitlists.has(launchingFeature.id)}
              onDismiss={handleDismissLaunchBanner}
              onJoinWaitlist={handleJoinWaitlist}
              onLearnMore={handleLearnMore}
            />
          )}
          <section>
            <div className="flex justify-between items-center mb-4"><h3 className="text-[17px] font-semibold text-[#111111]">Upcoming</h3><button onClick={() => onNavigate('services/bookings')} className="flex items-center text-[14px] font-medium text-[#6E6E73] active:opacity-70">View all <ChevronRight size={16} className="ml-0.5" /></button></div>
            {filteredBookings.length > 0 ? (
              <div className="space-y-3">{filteredBookings.slice(0, 2).map((b) => (
                <Card key={b.id} clickable className="!p-5 shadow-[0_4px_24px_rgba(0,0,0,0.015)] border-black/[0.03]">
                  <div className="flex justify-between items-start mb-3"><div className="flex items-center gap-3"><Avatar src={b.walkerAvatar} size={40} /><div className="flex flex-col"><span className="text-[15px] font-bold text-[#111111] leading-tight">{b.walkerName} · {b.walkerRating} <Star size={12} className="inline text-[#FF9500] fill-[#FF9500] mb-0.5" /></span><span className="text-[13px] text-[#6E6E73]">{b.service} · {selectedPet.name}</span></div></div><Badge variant={getBadgeVariant(b.status)}>{b.status}</Badge></div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#8E8E93]"><Calendar size={14} />{formatDateTime(b.date)}</div>
                </Card>
              ))}</div>
            ) : <Card className="!p-0 overflow-hidden"><EmptyState icon={Calendar} title="No upcoming bookings" description="Book your first walk to get started." /></Card>}
          </section>
          <section className="grid grid-cols-3 gap-3">
            <Card clickable onClick={() => onNavigate('services')} className="!p-2.5 flex flex-col items-center justify-center gap-2 text-center aspect-square !rounded-[24px] bg-[#FCFCFA] border border-black/[0.02]"><div className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#FF6B35]"><PawPrint size={22} strokeWidth={2} /></div><span className="text-[13px] font-medium text-[#111111]">Book Walk</span></Card>
            <Card clickable onClick={() => alert("Photo picker - Coming soon")} className="!p-2.5 flex flex-col items-center justify-center gap-2 text-center aspect-square !rounded-[24px] bg-[#FCFCFA] border border-black/[0.02]"><div className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#8E8E93]"><Camera size={22} strokeWidth={2} /></div><span className="text-[13px] font-medium text-[#111111]">Add Photo</span></Card>
            <Card clickable onClick={() => setMedSheetOpen(true)} className="!p-2.5 flex flex-col items-center justify-center gap-2 text-center aspect-square !rounded-[24px] bg-[#FCFCFA] border border-black/[0.02]"><div className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#8E8E93]"><Pill size={22} strokeWidth={2} /></div><span className="text-[13px] font-medium text-[#111111]">Log Med</span></Card>
          </section>
          {filteredReminders.length > 0 && (
            <section><div className="flex justify-between items-center mb-4"><h3 className="text-[17px] font-semibold text-[#111111]">Today</h3></div>
              <div className="space-y-4">{filteredReminders.map(r => { const isDone = completedReminders.has(r.id); return (
                <Card key={r.id} className="!p-4 flex items-center gap-3">
                  <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${isDone ? 'grayscale opacity-50' : 'bg-[#F7F7F8]'}`}>{renderLegacyIcon(r.icon, 18, 'text-[#6E6E73]')}</div>
                  <div className={`flex flex-col flex-1 min-w-0 ${isDone ? 'opacity-60' : ''}`}><span className={`text-[15px] font-semibold truncate ${isDone ? 'text-[#8E8E93]' : 'text-[#111111]'}`}>{r.title}</span><span className="text-[13px] text-[#6E6E73]">{r.time}</span></div>
                  {isDone ? <div className="text-[13px] font-medium text-[#8E8E93] flex items-center gap-1"><CheckCircle2 size={14} /> Done</div> : <Button variant="ghost" size="small" fullWidth={false} onClick={() => handleCompleteReminder(r.id)} className="!py-1 !px-2.5 text-[12px] !rounded-[10px] text-[#8E8E93] border border-black/[0.06]">Done</Button>}
                </Card>
              ); })}</div>
            </section>
          )}
          {filteredSuggestions.length > 0 && (
            <section className="mt-6"><h3 className="text-[17px] font-semibold text-[#111111] mb-4">Suggested</h3>
              <div className="space-y-4">{filteredSuggestions.slice(0, 2).map(s => (
                <Card key={s.id} className="!p-4 flex items-center gap-4"><div className="w-[48px] h-[48px] rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">{renderLegacyIcon(s.icon, 20, 'text-[#6E6E73]')}</div><div className="flex flex-col flex-1 min-w-0"><span className="text-[15px] font-semibold text-[#111111] truncate">{s.title}</span><span className="text-[13px] text-[#6E6E73] truncate">{s.context}</span></div><button onClick={() => onNavigate('services')} className="text-[14px] font-medium text-[#FF6B35]/85 flex items-center gap-1 active:opacity-70">Book <ArrowRight size={14} /></button></Card>
              ))}</div>
            </section>
          )}
        </div>
      </div>
      <BottomSheet isOpen={medSheetOpen} onClose={() => setMedSheetOpen(false)} title="Quick med log"><div className="space-y-6 pt-2"><TextInput label="Medication Name" placeholder="e.g. Heartworm chew" value={medName} onChange={(e) => setMedName(e.target.value)} /><div className="flex gap-3 pt-2"><Button variant="secondary" onClick={() => setMedSheetOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => { alert("Saved (mock)"); setMedSheetOpen(false); setMedName(''); }} disabled={!medName.trim()}>Save</Button></div></div></BottomSheet>
      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}} />
    </ScreenContainer>
  );
};
```

