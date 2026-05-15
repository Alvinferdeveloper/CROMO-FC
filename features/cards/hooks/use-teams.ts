import { useState, useMemo } from 'react'

export interface Team {
  name: string
  code: string // 3-letter album code (e.g., ARG)
  iso: string  // 2-letter ISO code for FlagCDN (e.g., ar)
}

export const TEAMS: Team[] = [
  { name: "Argelia", code: "ALG", iso: "dz" },
  { name: "Argentina", code: "ARG", iso: "ar" },
  { name: "Australia", code: "AUS", iso: "au" },
  { name: "Austria", code: "AUT", iso: "at" },
  { name: "Bélgica", code: "BEL", iso: "be" },
  { name: "Bosnia y Herzegovina", code: "BIH", iso: "ba" },
  { name: "Brasil", code: "BRA", iso: "br" },
  { name: "Canadá", code: "CAN", iso: "ca" },
  { name: "Cabo Verde", code: "CPV", iso: "cv" },
  { name: "Colombia", code: "COL", iso: "co" },
  { name: "Croacia", code: "CRO", iso: "hr" },
  { name: "Curazao", code: "CUW", iso: "cw" },
  { name: "Chequia", code: "CZE", iso: "cz" },
  { name: "República Democrática del Congo", code: "COD", iso: "cd" },
  { name: "Ecuador", code: "ECU", iso: "ec" },
  { name: "Egipto", code: "EGY", iso: "eg" },
  { name: "Inglaterra", code: "ENG", iso: "gb-eng" },
  { name: "Francia", code: "FRA", iso: "fr" },
  { name: "Alemania", code: "GER", iso: "de" },
  { name: "Ghana", code: "GHA", iso: "gh" },
  { name: "Haití", code: "HAI", iso: "ht" },
  { name: "Irán", code: "IRN", iso: "ir" },
  { name: "Irak", code: "IRQ", iso: "iq" },
  { name: "Costa de Marfil", code: "CIV", iso: "ci" },
  { name: "Japón", code: "JPN", iso: "jp" },
  { name: "Jordania", code: "JOR", iso: "jo" },
  { name: "México", code: "MEX", iso: "mx" },
  { name: "Marruecos", code: "MAR", iso: "ma" },
  { name: "Países Bajos", code: "NED", iso: "nl" },
  { name: "Nueva Zelanda", code: "NZL", iso: "nz" },
  { name: "Noruega", code: "NOR", iso: "no" },
  { name: "Panamá", code: "PAN", iso: "pa" },
  { name: "Paraguay", code: "PAR", iso: "py" },
  { name: "Portugal", code: "POR", iso: "pt" },
  { name: "Catar", code: "QAT", iso: "qa" },
  { name: "Arabia Saudita", code: "KSA", iso: "sa" },
  { name: "Escocia", code: "SCO", iso: "gb-sct" },
  { name: "Senegal", code: "SEN", iso: "sn" },
  { name: "Sudáfrica", code: "RSA", iso: "za" },
  { name: "Corea del Sur", code: "KOR", iso: "kr" },
  { name: "España", code: "ESP", iso: "es" },
  { name: "Suecia", code: "SWE", iso: "se" },
  { name: "Suiza", code: "SUI", iso: "ch" },
  { name: "Túnez", code: "TUN", iso: "tn" },
  { name: "Turquía", code: "TUR", iso: "tr" },
  { name: "Estados Unidos", code: "USA", iso: "us" },
  { name: "Uruguay", code: "URU", iso: "uy" },
  { name: "Uzbekistán", code: "UZB", iso: "uz" }
].sort((a, b) => a.name.localeCompare(b.name));

export function useTeams() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTeams = useMemo(() => {
    return TEAMS.filter(team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return {
    teams: TEAMS,
    filteredTeams,
    setSearchTerm,
    searchTerm
  }
}
