import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import ListingItem from "../components/ListingItems";
import Slider from "../components/Slider";
import { db } from "../firebase";
import { SiWelcometothejungle } from "react-icons/si";
import { RiHomeHeartFill } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import { FaIdeal } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";

export default function Home() {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);
  const [searchPrice, setSearchPrice] = useState("");

  useEffect(() => {
    async function fetchOfferListings() {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where("offers", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log("Error fetching offer listings:", error);
      }
    }

    fetchOfferListings();
  }, []);

  useEffect(() => {
    async function fetchRentListings() {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log("Error fetching rent listings:", error);
      }
    }

    fetchRentListings();
  }, []);

  useEffect(() => {
    async function fetchSaleListings() {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log("Error fetching sale listings:", error);
      }
    }

    fetchSaleListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        <div className="overflow-x-hidden bg-red-300 flex items-center">
          <div className="py-1 animate-marquee whitespace-nowrap">
            <span className="mx-3 text-2xl text-blue-600 flex items-center">
              <span className="flex items-center mr-4">
                <SiWelcometothejungle className="text-2xl text-red-600 mr-1" />
                Welcome to Our Listings
              </span>
              <span className="flex items-center mr-4">
                <RiHomeHeartFill className="text-2xl text-red-600 mr-1" />
                Find Your Dream Home
              </span>
              <span className="flex items-center mr-4">
                <BiSolidOffer className="text-2xl text-red-600 mr-1" />
                Exclusive Offers
              </span>
              <span className="flex items-center mr-4">
                <FaIdeal className="text-2xl text-red-600 mr-1" />
                Best Deals
              </span>
              <span className="flex items-center mr-4">
                <MdContactPhone className="text-2xl text-red-600 mr-1" />
                Contact Us Today
              </span>
            </span>
          </div>
        </div>
        <div className="m-2 mb-6">
          <h2 className="px-3 text-2xl mt-6 font-semibold 	">  Search Listings by Price</h2>
          <div className="px-3 mb-4 flex items-center">
            <input
              type="text"
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              placeholder="Enter maximum price"
              className="border p-2 rounded w-full"
            />
            <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
              <Link to={`/search-results/${searchPrice}`}>Search</Link>
            </button>
          </div>
        </div>
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Places for rent
            </h2>
            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Places for sale
            </h2>
            <Link to="/category/sale">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
