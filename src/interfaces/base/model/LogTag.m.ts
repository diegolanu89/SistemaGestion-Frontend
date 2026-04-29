export enum LogTag {
	// =========================
	//RA
	// =========================
	Adapter = 'Service API',
	SessionSocket = 'SessionSocket',
	AuthSession = 'AuthSession',

	// =========================
	// BIOMETRIC / SECURITY
	// =========================
	UseBiometricStatus = 'UseBiometricStatus',
	Biometric = 'Biometric',

	// =========================
	// STATE / UI
	// =========================
	EditProfileState = 'EditProfileState',

	// =========================
	// MAP / TRAVEL
	// =========================
	Maps = 'Maps',
	TravelTimeline = 'TravelTimeline',
	Provider = 'Provider',
	Cache = 'Cache',
	AdapterERROR = 'Service Error',
}
