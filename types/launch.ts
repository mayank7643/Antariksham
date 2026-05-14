export type LaunchStatus =
  | 'go'
  | 'tbd'
  | 'success'
  | 'failure'
  | 'hold'
  | 'in-flight'
  | 'partial-failure'

export interface Launch {
  id:            string
  name:          string
  slug:          string
  rocket:        string
  launchDate:    string | null
  windowStart:   string | null
  windowEnd:     string | null
  status:        LaunchStatus
  launchSite:    string | null
  launchPad:     string | null
  livestreamUrl: string | null
  agency:        string | null
  missionId:     string | null
  description:   string | null
  probability:   number | null
  weather:       string | null
  updatedAt:     string
}

export interface LaunchLibraryResponse {
  count:   number
  next:    string | null
  results: LaunchLibraryLaunch[]
}

export interface LaunchLibraryLaunch {
  id:     string
  name:   string
  net:    string
  status: { name: string; abbrev: string }
  rocket: { configuration: { name: string; family: string } }
  launch_service_provider: { name: string; abbrev: string }
  pad: { name: string; location: { name: string } }
  vidURLs: Array<{ url: string }>
}
