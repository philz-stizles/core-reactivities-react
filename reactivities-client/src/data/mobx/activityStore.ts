import { RootStore } from './rootStore';
import { IActivity } from './../../models/IActivity';
import { action, computed, makeObservable, observable } from "mobx";
import { Activities } from '../../api/agent'
import { IUser } from '../../models/IUser';
import { SyntheticEvent } from 'react';

export default class ActivityStore {
    rootStore: RootStore

    @observable activitiesRegistry = new Map()
    @observable user: IUser | undefined | null
    @observable activities: IActivity[] = []
    @observable selectedActivity: IActivity | undefined | null
    @observable isLoading = false
    @observable isSubmitting = false
    @observable editMode = false
    @observable target = ''

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeObservable(this)
    }

    @computed get activitiesByDate() {
        return Array.from(this.activitiesRegistry.values()).sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    }

    @action loadActivities = async () => {
        this.isLoading = true;
        try {
            const pagedActivities = await Activities.list()
            pagedActivities.activities.forEach((activity) => {
                this.activitiesRegistry.set(activity.id, activity);
            })
            this.isLoading = false
        } catch (error) {
            console.log(error)
            this.isLoading = false
        }
    }

    // @action loadActivities = () => {
    //     this.isLoading = true;
    //     Activities.list()
    //         .then(pagedActivities => {
    //             pagedActivities.activities.forEach((activity) => {
    //                 this.activities.push(activity);
    //             })
    //         })
    //         .catch(() => {
    //              this.isLoading = false
    //              console.log(error)
    //         })
    //         .finally(() => this.isLoading = false)
    // }

    @action setActivity = (selectedActivity: IActivity | undefined | null) => {
        this.selectedActivity = selectedActivity
    }

    @action setCreateMode = () => {
        this.editMode = true
        this.selectedActivity = undefined
    }

    @action setEditMode = (id: string) => {
        this.selectedActivity = this.activitiesRegistry.get(id)
        this.editMode = true
    }

    @action closeForm = () => {
        this.editMode = false
    }

    @action closeDetail = () => {
        this.selectedActivity = undefined
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activitiesRegistry.get(id)
        this.editMode = false
    }

    // @action selectActivity = (id: string) => {
    //     this.selectedActivity = this.activities.find(activity => activity.id === id)
    //     this.editMode = false
    // }

    @action createActivity = async (activity: IActivity) => {
        console.log("here")
        this.isSubmitting = true
        try {
            await Activities.create(activity)
            this.activitiesRegistry.set(activity.id, activity)
            this.editMode = false
            this.isSubmitting = false
        } catch (error) {
            this.isSubmitting = false
            console.log(error)
        }
    }

    // @action createActivity = (activity: IActivity) => {
    //     this.isSubmitting = true
    //     Activities.create(activity)
    //         .then(response => {
    //             this.activities.push(activity)
    //             this.editMode = false
    //         }).catch(() {
    //              console.log(error)    
    //         })
    //         .finally(() => this.isSubmitting = false)
    // }

    @action editActivity = async (activity: IActivity) => {
        this.isSubmitting = true
        try {
            await Activities.update(activity)
            this.activitiesRegistry.set(activity.id, activity)
            this.selectedActivity = activity
            this.editMode = false
            this.isSubmitting = false
        } catch (error) {
            this.isSubmitting = false
            console.log(error)
        }
    }

    // @action editActivity = (activity: IActivity) => {
    //     this.isSubmitting = true
    //     Activities.update(activity)
    //         .then(response => {
    //             this.activities = [...this.activities.filter(a => a.id !== activity.id), activity]
    //             this.selectedActivity = activity
    //             this.editMode = false
    //         }).finally(() => this.isSubmitting = false)
    // }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.isSubmitting = true
        this.target = event.currentTarget.name
        try {
            await Activities.delete(id)
            this.activitiesRegistry.delete(id)
            // this.selectedActivity = (id === this.selectedActivity.id) ? undefined : this.selectActivity
            this.isSubmitting = false
            this.target = ''
        } catch (error) {
            this.isSubmitting = false
            this.target = ''
            console.log(error)
        }
    }

    // @action deleteActivity = (id: string) => {
    //     this.isLoading = true
    //     Activities.delete(id)
    //         .then(response => {
    //             this.activities = this.activities.filter(a => a.id !== id)
    //             this.editMode = false
    //         }).finally(() => this.isLoading = false)
    // }
}

// export default createContext(new ActivityStore())