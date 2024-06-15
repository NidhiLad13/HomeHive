import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import ListingItem from "../components/ListingItems";
import { db } from "../firebase";

const SearchResultsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    async function fetchListings() {
      setLoading(true); // Start loading state

      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("regularPrice", "<=", params.searchPrice),
          orderBy("timestamp", "desc"),
          limit(8)
        );

        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        console.log("Fetched listings:", listings); // Debugging log
        setListings(listings);

        setLoading(false); // Set loading state to false after fetching data
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("Could not fetch listings"); // Notify user about error
        setLoading(false); // Ensure loading state is false on error
      }
    }

    if (params.searchPrice) {
      fetchListings();
    } else {
      // Handle case where no searchPrice is provided
      setListings([]);
      setLoading(false);
    }
  }, [params.searchPrice]);

  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Search Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))
          ) : (
            <p>No listings found for price: {params.searchPrice}</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
