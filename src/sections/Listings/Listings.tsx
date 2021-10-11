import React, {useRef, useState} from "react";
import {gql} from "apollo-boost";
import {useQuery, useMutation} from "@apollo/react-hooks";
import {Alert, Avatar, Button, List, Spin} from "antd";
import {Listings as ListingsData} from "./__generated__/Listings";
import {ListingsSkeleton} from "./components";
import {
    DeleteListing as DeleteListingData,
    DeleteListingVariables
} from "./__generated__/DeleteListing";
import "./styles/Listings.css";
import ModalForm from "./ModalForm";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
    title: string;
}

export const Listings = ({title}: Props) => {
    const [visible, setVisible] = useState(false);
    const refContainer = useRef(null);

    const {data, loading, error, refetch} = useQuery<ListingsData>(LISTINGS);

    const [
        deleteListing,
        {loading: deleteListingLoading, error: deleteListingError}
    ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

    const handleDeleteListing = async (id: string) => {
        await deleteListing({variables: {id}});
        refetch();
    };

    const listings = data ? data.listings : null;
    const handleCreate = () => {
        console.log("It won't work");
        // @ts-ignore
        const { form } = refContainer.current;
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }

            console.log("Received values of form: ", values);
            form.resetFields();
            setVisible(false);
        });
    };

    const saveFormRef = (formRef: any) => {
        refContainer.current = formRef;
    };

    // @ts-ignore
    const listingsList = listings ? (
        <List
            itemLayout="horizontal"
            dataSource={listings}
            renderItem={listing => (
                <List.Item
                    actions={[
                        <Button
                            type="primary"
                            onClick={() => handleDeleteListing(listing.id)}
                        >
                            Delete
                        </Button>,
                        <Button
                            type="primary"
                            //onClick={}
                        >
                            Add
                        </Button>,
                        <ModalForm
                            wrappedComponentRef={saveFormRef}
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            onCreate={() => handleCreate()}
                        />,
                        <Button
                            type="danger"
                            onClick={() => setVisible(true)}
                        >
                            Delete
                        </Button>
                    ]}
                >
                    <List.Item.Meta
                        title={listing.title}
                        description={listing.address}
                        avatar={<Avatar src={listing.image} shape="square" size={48}/>}
                    />
                </List.Item>
            )}
        />
    ) : null;

    if (loading) {
        return (
            <div className="listings">
                <ListingsSkeleton title={title}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="listings">
                <ListingsSkeleton title={title} error/>
            </div>
        );
    }

    const deleteListingErrorAlert = deleteListingError ? (
        <Alert
            type="error"
            message="Uh oh! Something went wrong :(. Please try again later."
            className="listings__alert"
        />
    ) : null;

    return (
        <div className="listings">
            {deleteListingErrorAlert}
            <Spin spinning={deleteListingLoading}>
                <h2>{title}</h2>
                {listingsList}
            </Spin>
        </div>
    );
};
