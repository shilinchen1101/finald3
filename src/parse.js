export default function(d){

	const t = new Date(d.Date);


	return {
		t: t,
		month:t.getMonth(),
		date:t.toDateString(),
		name: d.VictimsName,
		age: d.VictimsAge,
		gender: d.VictimsGender,
		race: d.VictimsRace,
		urlOfVictimes: d.URL,
		state: d.State,
		agency: d.Agency,
    description:d.Description,
		lat:d.Latitude,
		lon:d.Longitude,
		unarmed:d.Unarmed
	}
}
