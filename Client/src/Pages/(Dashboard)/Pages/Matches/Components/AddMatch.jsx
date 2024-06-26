import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Components/formStyle.css';
import axios from 'axios';
import { ApiUrl } from '../../../../../Config/ApiUrl';
import { useNavigate } from 'react-router-dom';
function AddMatch({ setShowForm }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    match_date: "",
    team_id_1: "",
    team_id_2: "",
    event_id: "", // Changed from "event" to "event_id"
  });

  console.log("formData", formData);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, eventsResponse] = await Promise.all([
          ApiUrl.get("/team"),
          ApiUrl.get("/event")
        ]);
        setTeams(teamsResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error if needed
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const { match_date, team_id_1, team_id_2, event_id } = formData;

      // Create match
      const matchResponse = await ApiUrl.post("/match", { match_date , event_id });
      console.log("match response", matchResponse.data.newMatch.id);
      // Connect teams and event
      console.log("start connecting");
      await Promise.all([
        connectTeams(matchResponse.data.newMatch.id, team_id_1 , team_id_2 ),
      ]);

      // Show success message
      toast.success(matchResponse.data.message);

      // Reset form and navigate
      setFormData({
        match_date: "",
        team_id_1: "",
        team_id_2: "",
        event_id: ""
      });
      setLoading(false)
      navigate(0);
    } catch (error) {
      setLoading(false)
      setError(error.response.data.error);
      console.error("Error creating match:", error);
      toast.error(error.response.data.error);
    }
  };

  const connectTeams = async (match_id, team_id_1 , team_id_2) => {
    try {
      console.log("from connect teams", match_id, team_id_1 , team_id_2);
      const team_ids = [team_id_1, team_id_2];
      await ApiUrl.post(`/match/connectteams/${match_id}` , {team_ids});
    } catch (error) {
      console.error("Error connecting team:", error);
      throw error;
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 min-h-screen flex justify-center items-center bg-gray-100 bg-opacity-50 p-0  transition-transform ease-in duration-300 ">
        <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl md:w-full w-[80%]">
          <section className='flex justify-between items-center mb-8'>
            <h1 className="text-2xl text-main    font-bold">Create New Match</h1>
            <button onClick={() => setShowForm(false)}>Close</button>
          </section>
          <form id="form" onSubmit={handleSubmit}>

            <div className="relative z-0 w-full mb-5">
              <input onChange={handleInputChange} type="date" name="match_date" placeholder=" " className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200" />
              <label htmlFor="match_date" className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Enter Match Date</label>
              <span className="text-sm text-red-600 hidden" id="error">match date is required</span>
            </div>

            <div className="relative z-0 w-full mb-5">
              <select onChange={handleInputChange} name="event_id" placeholder="select an event" className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200">
                <option value selected disabled hidden />
                {
                  events.map((event) => (
                    <option value={event.id}>{event.event_name}</option>
                  ))
                }
              </select>
              <label htmlFor="select" className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Select an Event</label>
              <span className="text-sm text-red-600 hidden" id="error">Option has to be selected</span>
            </div>
            <div className="relative z-0 w-full mb-5">
              <select onChange={handleInputChange} name="team_id_1" placeholder="select a team" className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200">
                <option value selected disabled hidden />
                {
                  teams.map((team) => (
                    <option value={team.id}>{team.team_name}</option>
                  ))
                }
              </select>
              <label htmlFor="select" className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Select an Team</label>
              <span className="text-sm text-red-600 hidden" id="error">Option has to be selected</span>
            </div>
            <div className="relative z-0 w-full mb-5">
              <select onChange={handleInputChange} name="team_id_2" placeholder="select a team" className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200">
                <option value selected disabled hidden />
                {
                  teams.map((team) => (
                    <option value={team.id}>{team.team_name}</option>
                  ))
                }
              </select>
              <label htmlFor="select" className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Select an Team</label>
              <span className="text-sm text-red-600 hidden" id="error">Option has to be selected</span>
            </div>
            <button
              disabled={loading}
              id="button"
              type="button"
              onClick={handleSubmit} // Call the handleSubmit function on button click // Disable the button while the form is being submitted
              className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-main hover:text-white hover:bg-opacity-80 hover:shadow-lg focus:outline-none"
            >
              {loading ? 'Submitting...' : 'Send'}
            </button>
          </form>
        </div >
      </div >
      <ToastContainer position="bottom-right" autoClose={1000} />
    </>
  )
}

export default AddMatch