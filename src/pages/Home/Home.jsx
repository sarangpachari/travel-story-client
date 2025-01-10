import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import EmptyImg from "../../assets/images/add-story.webp";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  //GET USER INFO
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        //SET USER INFO IF DATA EXISTS
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        //CLEAR STORAGE IF UNAUTHORIZED
        localStorage.clear();
        //REDIRECTS TO LOGIN
        navigate("/login");
      }
    }
  };

  //GET ALL TRAVEL STORIES
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        //SET ALL STORIES IF DATA EXISTS
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  //HANDLE EDIT STORY CLICK
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  //HANDLE TRAVEL STORY CLICK
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  //HANDLE UPDATE FAVOURITE
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");

        if (filterType === "search" && searchQuery) {
          onSearchStory(searchQuery);
        } else if (filterType === "date") {
          filterStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  //DELETE STORY
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  //SEARCH STORY
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });

      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  //HANDLE FILTER TRAVEL STORY BY DATE RANGE
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: {
            startDate,
            endDate,
          },
        });
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  //HANDLE DATE RANGE SELECT
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />

        <div className="flex flex-col md:flex-row gap-7">
          <div className="flex-1">
            {allStories?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allStories?.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item?._id}
                      imgUrl={item?.imageUrl}
                      title={item?.title}
                      story={item?.story}
                      date={item?.visitedDate}
                      visitedLocation={item?.visitedLocation}
                      isFavourite={item?.isFavourite}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                imgSrc={EmptyImg}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>
          <div className="w-full md:w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD & EDIT TRAVEL STORY MODAL */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          },
          content: {
            width: "90%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            borderRadius: "10px",
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* VIEW TRAVEL STORY MODAL */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          },
          content: {
            width: "90%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            borderRadius: "10px",
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-4 bottom-4 md:right-10 md:bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* TOAST CONTAINER */}
      <ToastContainer />
    </>
  );
};

export default Home;
