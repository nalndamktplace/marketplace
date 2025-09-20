import { useEffect, useState } from "react";
import { COLLECTION } from "../api/collection/collection";
import { Link } from "react-router-dom";

function Ribbon() {
  const [collectionsHeadingRibbon, setCollectionsHeadingRibbon] = useState([]);
  const { specifCollectionMutateAsync } =
    COLLECTION.getSpecificCollectionMutation();
  const { collectionData } = COLLECTION.getCollectionQuery();

  const collectionsHeadingRibbonNeed = [
    "highest rated",
    "best selling",
    "new releases",
  ];

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsHeadingRibbonNeedPromises = collectionData
          .filter((r: any) => collectionsHeadingRibbonNeed.includes(r.name))
          .map(async (r: any) => {
            const data = await specifCollectionMutateAsync({
              collectionId: r.id,
            });

            return { ...r, books: data }; // Or return data if needed
          });

        await specifCollectionMutateAsync({
          collectionId: "73cf72b3-ec16-4964-8625-e951ead58ef5",
        });

        const collectionsHeadingRibbonNeedResults = await Promise?.all(
          collectionsHeadingRibbonNeedPromises
        );
        setCollectionsHeadingRibbon(collectionsHeadingRibbonNeedResults as any);
      } catch (error) {
        // console.error("Error processing collections:", error);
      }
    };

    fetchCollections();
  }, [collectionData]);

  return (
    <div className="p-3 bg-primary">
      <div className="container flex gap-10 font-medium cursor-pointer ">
        {collectionsHeadingRibbon?.map((item: any, key: any) => (
          <Link
            to="/collection"
            state={{
              id: item.id,
              name: item.name,
            }}
            key={key}
          >
            <span className="capitalize ">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Ribbon;
