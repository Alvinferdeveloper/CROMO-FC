import { useState, useMemo } from 'react'

export const WORLD_CUP_TEAMS = [
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Bosnia and Herzegovina",
  "Brazil",
  "Canada",
  "Cape Verde",
  "Colombia",
  "Croatia",
  "Curacao",
  "Czechia",
  "DR Congo",
  "Ecuador",
  "Egypt",
  "England",
  "France",
  "Germany",
  "Ghana",
  "Haiti",
  "Iran",
  "Iraq",
  "Ivory Coast",
  "Japan",
  "Jordan",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Panama",
  "Paraguay",
  "Portugal",
  "Qatar",
  "Saudi Arabia",
  "Scotland",
  "Senegal",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tunisia",
  "Turkey",
  "United States",
  "Uruguay",
  "Uzbekistan"
].sort();
export function useTeams() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTeams = useMemo(() => {
    return WORLD_CUP_TEAMS.filter(team =>
      team.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return {
    teams: WORLD_CUP_TEAMS,
    filteredTeams,
    setSearchTerm,
    searchTerm
  }
}
