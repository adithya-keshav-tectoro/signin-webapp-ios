/* eslint-disable max-depth */
/* eslint-disable max-nested-callbacks */
// import info from '../../assets/images/svg/information.svg';
import { UncontrolledTooltip } from 'reactstrap';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import EllipsisToolTip from './Tooltip/Tooltip';
import { store } from 'slices/persistor';

interface Field {
    type: string;
    label: string;
    mandatory: boolean;
    minLen?: number;
    maxLen?: number;
    regex?: string;
    value: string;
}

export const getDate = (date: any, dateWithoutTime: any) => {
    const sDate = new Date();
    if (!date) {
        date = new Date(sDate);
    }
    date = new Date(date);
    let DATE_OPTIONS: any = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    if (dateWithoutTime) {
        DATE_OPTIONS = { year: 'numeric', month: 'short', day: 'numeric' };
    }
    return date.toLocaleDateString('en-US', DATE_OPTIONS);
};

export const getTime = (d: any) => {
    const date = new Date(d);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

const convertBytesTo = (bytes: any) => {
    const decimals = 0;
    if (!+bytes) return '0 Bytes';

    const k = 1023;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const convertDataToBytes = (size: any) => {
    const unit = size.substring(size.length - 2, size.length);
    const amount = parseInt(size.substring(0, size.length - 2));
    let valueInBytes = 0;
    switch (unit?.toUpperCase()) {
        case 'KB':
            valueInBytes = amount * 1024;
            break;
        case 'MB':
            valueInBytes = amount * 1024 * 1024;
            break;
        case 'GB':
            valueInBytes = amount * 1024 * 1024 * 1024;
            break;
        case 'TB':
            valueInBytes = amount * 1024 * 1024 * 1024 * 1024;
            break;
        default:
            break;
    }
    return valueInBytes;
};

const convertSecondsTo = (time: any) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    return { minutes, seconds };
};

export const getDateOnly = (date: any) => {
    return getDate(date, true);
};

export const getDateUTCFormatt = (param: any) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateObj = new Date(param);
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return month + '\n' + day + ', ' + year;
};

const getUTCTime = (date: any) => {
    return date === '' || date === null ? date : new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

const uniqBy = (arr: any, predicate: any) => {
    const cb = typeof predicate === 'function' ? predicate : (o: any) => o[predicate];
    return [
        ...arr
            .reduce((map: any, item: any) => {
                const key = item === null || item === undefined ? item : cb(item);
                map.has(key) || map.set(key, item);
                return map;
            }, new Map())
            .values()
    ];
};

export const uniqueID = (length: any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const getMonth = (val: any) => {
    return val > 9 ? '-' + val : '-0' + val;
};

const getDateVal = (val: any) => {
    return val > 9 ? val : '0' + val;
};

const convertTextCase = (name: any, param: any) => {
    let result;
    if (param) result = name?.charAt(0)?.toUpperCase() + name?.substr(1)?.toLowerCase();
    else result = name?.charAt(0)?.toUpperCase() + name?.substr(1);
    return result;
};

const getUTCGteLteFromDate = (dateVal: any) => {
    const time = new Date(dateVal);
    const previousDay = new Date(dateVal - 1);
    const gte =
        previousDay.getFullYear() + getMonth(previousDay.getMonth() + 1) + '-' + getDateVal(previousDay.getDate()) + 'T18:31:00.000Z';
    const lte = time.getFullYear() + getMonth(time.getMonth() + 1) + '-' + getDateVal(time.getDate()) + 'T18:29:00.000Z';
    return { gte: gte, lte: lte };
};

/*
 * function debounce(func:any, wait:any, immediate:any) {
 *     let timeout:any;
 *     return function () {
 *         // eslint-disable-next-line @typescript-eslint/no-this-alias
 *         var context = this,
 *             args = arguments;
 *         var later = function () {
 *             timeout = null;
 *             if (!immediate) func.apply(context, args);
 *         };
 *         var callNow = immediate && !timeout;
 *         clearTimeout(timeout);
 *         timeout = setTimeout(later, wait);
 *         if (callNow) func.apply(context, args);
 *     };
 * }
 */

const InfoMessage = (message: any) => {
    return (
        <div className="d-flex justify-content-end">
            <div className="d-flex mb-3">
                <span className="info-message p-2">
                    {/* <img className="me-1" src={info} alt="info Icon" /> */}
                    <img className="me-1" src={''} alt="info Icon" />
                    {message}
                </span>
            </div>
        </div>
    );
};

const convertUTCtoIST = (date: any, dateOnly: any) => {
    if (date !== null && date !== '' && date !== undefined) {
        const dateUTC = new Date(date);
        const dateUTCTime = dateUTC.getTime();
        const dateIST = new Date(dateUTCTime);
        dateIST.setHours(dateIST.getHours() + 5); // date shifting for IST timezone (+5 hours and 30 minutes)
        dateIST.setMinutes(dateIST.getMinutes() + 30);
        return dateOnly ? getDateOnly(dateIST) : getDate(dateIST, '');
    } else {
        return dateOnly ? getDateOnly(new Date()) : getDate(new Date(), '');
    }
};

const convertDate = (str: any, key: any) => {
    const date = new Date(str),
        mnth = ('0' + (date.getMonth() + 1)).slice(-2),
        day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join(key);
};

export const getFormTypeAndRecordId = (path: any) => {
    let formType;
    let recordID = '';
    const addExist = path.search('/add') !== -1;
    const createExist = path.search('/create') !== -1;
    const viewExist = path.search('/view') !== -1;
    const editExist = path.search('/edit') !== -1;
    const allExist = path.search('/all') !== -1;
    const cloneExist = path.search('/clone') !== -1;
    const enrollmentTokenExist = path.search('/enrollmenttoken') !== -1;
    if (editExist) {
        formType = 'edit';
        recordID = path.split('/').reverse()[0];
    } else if (viewExist) {
        formType = 'view';
        recordID = path.split('/').reverse()[0];
    } else if (addExist) {
        formType = 'add';
    } else if (createExist) {
        formType = 'create';
    } else if (allExist) {
        formType = 'all';
    } else if (cloneExist) {
        formType = 'clone';
        recordID = path.split('/').reverse()[0];
    } else if (enrollmentTokenExist) {
        recordID = path.split('/').reverse()[0];
    }
    return { formType: formType, recordID: recordID };
};

/*
 * export const getTenantInfo = () => {
 *     let userString = AuthUser();
 *     let user = JSON.parse(userString);
 *     let tenantInfo = user?.data?.tenant;
 *     let tenant = {
 *         COMPANY_LOGO_DARK: tenantInfo?.branding?.tenantLogo ? tenantInfo?.branding?.tenantLogo : '',
 *         COMPANY_LOGO_Light: tenantInfo?.branding?.tenantLogo ? tenantInfo?.branding?.tenantLogo : '',
 *         COMPANY_LOGO_WITH_LABEL_DARK: tenantInfo?.branding?.tenantLogoWithLabel ? tenantInfo?.branding?.tenantLogoWithLabel : '',
 *         COMPANY_LOGO_WITH_LABEL_Light: tenantInfo?.branding?.tenantLogoWithLabelLight ? tenantInfo?.branding?.tenantLogoWithLabelLight : '',
 *         COMPANY_ID: tenantInfo?.tenant ? tenantInfo?.tenant : '',
 *         COMPANY_NAME: tenantInfo?.name ? tenantInfo?.name : '',
 *         COMAPNY_PRIMARY_COLOR: '#0045FF',
 *         COMPANY_FOOTER: tenantInfo?.branding?.footerText ? tenantInfo?.branding?.footerText : '',
 *         COMPANY_FAVICON: tenantInfo?.branding?.tenantFavIcon ? tenantInfo?.branding?.tenantFavIcon : '',
 *         PAGE_NUM: 1,
 *         PAGE_SIZE: 10
 *     };
 *     return tenant;
 * };
 */

/*
 * const AuthUser = () => {
 *     return Store.getState()?.Commons?.authUser;
 * };
 */

/*
 * const LogoutTime = () => {
 *     return Store.getState().Commons?.logoutTime;
 * };
 */

export function DownloadFile(Url: any, fileNameToDownload: any) {
    fetch(process.env.REACT_APP_API_URL + '/api/' + Url).then((response) => {
        response.blob().then((blob) => {
            const fileURL = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = fileURL;
            a.download = fileNameToDownload;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
}

export const Tooltip = (id: any, label: any) => {
    return (
        <UncontrolledTooltip placement="bottom" target={id}>
            {label}
        </UncontrolledTooltip>
    );
};

export function secondsToHms(d: any) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
    return hDisplay + mDisplay + sDisplay;
}

export function diffTwoDatesHrsMintsSeconds(date: any) {
    const date1: any = new Date(date);
    const date2: any = new Date(date);
    const timeDiffInMs: any = Math.abs(date2 - date1);
    let seconds: any = Math.floor((timeDiffInMs / 1000) % 60);
    let minutes: any = Math.floor((timeDiffInMs / 1000 / 60) % 60);
    let hours: any = Math.floor((timeDiffInMs / 1000 / 60 / 60) % 24);
    const days = Math.floor((timeDiffInMs / 1000 / 60 / 60 / 24) % 7);
    const weeks = Math.floor(timeDiffInMs / 1000 / 60 / 60 / 24 / 7);
    const totalHours = Math.floor(timeDiffInMs / 1000 / 60 / 60);
    const totalMinutes = Math.floor(timeDiffInMs / 1000 / 60);
    const totalSeconds = Math.floor(timeDiffInMs / 1000);
    const totalDays = Math.floor(timeDiffInMs / 1000 / 60 / 60 / 24);
    const totalWeeks = Math.floor(timeDiffInMs / 1000 / 60 / 60 / 24 / 7);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        days: days,
        weeks: weeks,
        totalWeeks: totalWeeks,
        totalDays: totalDays,
        totalHours: totalHours,
        totalMinutes: totalMinutes,
        totalSeconds: totalSeconds
    };
}

export const ellipsisToolTip = (label: any) => {
    return <EllipsisToolTip options={{ effect: 'solid', place: 'bottom' }}>{label}</EllipsisToolTip>;
};

export const ellipsisWithToolTipId = (id: any, val: any) => {
    return (
        <EllipsisToolTip options={{ effect: 'solid', place: 'bottom' }} target={id}>
            {val}
        </EllipsisToolTip>
    );
};

export const ellipsisWithToolTip = (val: any) => {
    return <EllipsisToolTip options={{ effect: 'solid', place: 'bottom' }}>{val}</EllipsisToolTip>;
};

const AuthUser = () => {
    const authUser = store.getState()?.Login?.authUser;
    return authUser && authUser.length > 0 ? authUser : null;
};

export const IsAuthorized = (props: any) => {
    const userString = AuthUser();
    const user = JSON.parse(userString);
    if (props.privRequired) {
        const findPriv = user?.data?.privileges?.includes(props.privRequired);
        // console.log(findPriv);
        if (findPriv) return props.yes();
        else return props.no();
    } else return props.yes();
};

export const IsAuthorizedCondition = (props: any) => {
    const userString = AuthUser();
    const user = userString ? JSON.parse(userString) : '';
    if (user?.data?.[props.key] === props.value || user?.data?.[props.key]?.includes(props.value)) {
        return props.yes();
    }
    return props.no();
};

IsAuthorizedCondition.defaultProps = {
    yes: () => null,
    no: () => null
};
/*
 * const IsAuthorized = (props) => {
 *     let userString = AuthUser();
 *     let user = JSON.parse(userString);
 *     let roles = user?.data?.roles;
 *     if (props.privRequired) {
 *         let findPriv = roles.filter((role) => role.authority === props.privRequired)?.length > 0;
 *         if (findPriv) return props.yes();
 *         else return props.no();
 *     } else return props.yes();
 * };
 */

/*
 * IsAuthorized.defaultProps = {
 *     yes: () => null,
 *     no: () => null
 * };
 */

/*
 * const PrivCheck = (props) => {
 *     let userString = AuthUser();
 *     let user = JSON.parse(userString);
 *     let roles = user?.data?.roles;
 *     if (props.reader || props.editor) {
 *         let findPriv = roles.filter((role) => role.authority === props.reader || role.authority === props.editor)?.length > 0;
 */

/*
 *         if (findPriv) return props.yes();
 *         else return props.no();
 *     } else return props.yes();
 * };
 */

/*
 * PrivCheck.defaultProps = {
 *     yes: () => null,
 *     no: () => null
 * };
 */

/*
 * export const findReaderPrivilege = (readerPriv) => {
 *     let userString = AuthUser();
 *     let user = JSON.parse(userString);
 *     let roles = user?.data?.roles;
 *     return roles.filter((role) => role.authority === readerPriv)?.length === 0;
 * };
 */

/*
 * export const findEditorPrivilege = (editorPriv) => {
 *     let userString = AuthUser();
 *     let user = JSON.parse(userString);
 *     let roles = user?.data?.roles;
 *     return roles.filter((role) => role.authority === editorPriv)?.length === 0;
 * };
 */

const sortBy = (arr: any, key: any) => {
    return arr.sort((a: any, b: any) => (a[key] < b[key] ? -1 : b[key] < a[key] ? 1 : 0));
};

const noCaseSensitiveSortBy = (arr: any, key: any) => {
    return arr.sort((a: any, b: any) =>
        a[key]?.toLowerCase() < b[key]?.toLowerCase() ? -1 : b[key]?.toLowerCase() < a[key]?.toLowerCase() ? 1 : 0
    );
};

export const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const generateSeqOfNumbers = (startingNum: any, incrementBy: any) => {
    return Array(parseInt(startingNum))
        .fill('')
        .map((_element, index) => index + incrementBy);
};

const renderActionItems = (props: any, includeEdit = true, includeDelete = true) => {
    return (
        <>
            <div className="position-absolute top-0 start-100 icon-zIndex">
                {includeEdit && (
                    <div
                        className="badge-override-settings d-flex align-items-center justify-content-center cursor-pointer"
                        onClick={() => props.onClickEdit(props.item)}
                    >
                        <i className="ri-settings-3-line px-1"></i> <span className="showOnHover">Properties</span>
                    </div>
                )}
                {includeDelete && (
                    <div
                        className="badge-override-delete d-flex align-items-center justify-content-center cursor-pointer "
                        onClick={() => props.onClickDelete(props.item)}
                    >
                        <i className="ri-delete-bin-line px-1"></i> <span className="showOnHover">Delete</span>
                    </div>
                )}
            </div>
        </>
    );
};

const renderComponentActionItems = (props: any) => {
    return (
        <>
            <div className="position-absolute top-0 start-100 icon-zIndex">
                {props.data?.length > 0 && (
                    <div
                        className="badge-override-submit d-flex align-items-center justify-content-center cursor-pointer"
                        onClick={() => props.onClickSubmit()}
                    >
                        <i className="ri-check-line px-1"></i> <span className="showOnHover">Submit</span>
                    </div>
                )}
                <div
                    className="badge-override-delete d-flex align-items-center justify-content-center cursor-pointer "
                    onClick={() => props.onClickDelete()}
                >
                    <i className="ri-delete-bin-line px-1"></i> <span className="showOnHover">Delete</span>
                </div>
            </div>
        </>
    );
};

export const transformDropdownValuesToObjects = (formSchema: any, data: any) => {
    formSchema.forEach((schema: any) => {
        if (schema.inputType === 'dropdown' || schema.inpuType === 'radio') {
            data.forEach((obj: any) => {
                if (obj[schema.value]) {
                    if (!schema.isMulti && typeof obj[schema.value] === 'string') {
                        obj[schema.value] = schema?.options?.filter(
                            (option: any) => option.value?.toLowerCase() === obj[schema.value]?.toLowerCase()
                        );
                        obj[schema.value] = obj[schema.value].length > 0 ? obj[schema.value][0] : {};
                    } else if (schema.isMulti) {
                        const selectedOptions: any = [];
                        obj[schema.value].forEach((value: any) => {
                            selectedOptions.push(
                                schema?.options?.filter((option: any) => option.value.toLowerCase() === value.toLowerCase())[0]
                            );
                        });
                        obj[schema.value] = selectedOptions;
                    }
                }
            });
        }
    });
    return data;
};

export const transformDropdownValuesToString = (formSchema: any, data: any) => {
    formSchema.forEach((schema: any) => {
        if (schema.inputType === 'dropdown') {
            data?.forEach((obj: any) => {
                if (obj[schema.value] && obj[schema.value] !== undefined && Object.keys(obj[schema.value]).length > 0) {
                    if (!schema.isMulti) {
                        obj[schema.value] = obj[schema.value].value;
                    } else {
                        obj[schema.value] = obj[schema.value]?.map((valObj: any) => valObj.value);
                    }
                }
            });
        }
    });
    return data;
};

const getChartColorsArray = (colors: any) => {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
        const newValue = value.replace(' ', '');
        if (newValue.indexOf(',') === -1) {
            let color = getComputedStyle(document.documentElement).getPropertyValue(newValue);

            if (color.indexOf('#') !== -1) color = color.replace(' ', '');
            if (color) return color;
            else return newValue;
        } else {
            const val = value.split(',');
            if (val.length === 2) {
                let rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = 'rgba(' + rgbaColor + ',' + val[1] + ')';
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
};

export const getChartsData = (props: any) => {
    return {
        labels: props?.labels ? props?.labels : [],
        chart: {
            type: 'donut',
            height: 250
        },
        plotOptions: {
            pie: {
                size: 100,
                offsetX: 0,
                offsetY: 0,
                donut: {
                    size: '76%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '18px',
                            offsetY: -5
                        },
                        value: {
                            show: true,
                            fontSize: '20px',
                            color: '#343a40',
                            fontWeight: 500,
                            offsetY: 5,
                            formatter: function (val: any) {
                                return val;
                            }
                        },
                        total: {
                            show: true,
                            fontSize: '13px',
                            label: props?.label ? props?.label : 'Total Devices',
                            color: '#9599ad',
                            fontWeight: 500,
                            formatter: function (w: any) {
                                return props?.showTotal
                                    ? props?.totalDevices
                                    : w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                          return a + b;
                                      }, 0);
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'center',
            offsetX: 0,
            offsetY: 0,
            markers: {
                width: 15,
                height: 10,
                radius: 2
            },
            itemMargin: {
                horizontal: 12,
                vertical: 0
            }
        },
        colors: props?.colors ? props?.colors : []
    };
};

export const viewChange = (displayType: any, handleView: any) => {
    return (
        <>
            <button
                type="button"
                onClick={() => handleView('grid')}
                className={`me-2 ps-2 pe-2 pt-1 pb-1 btn ${displayType === 'grid' ? 'btn-info' : 'btn-soft-info waves-effect waves-light'}`}
            >
                <span className="d-flex align-items-center fs-18">
                    <i className="ri-grid-fill"></i>
                </span>
            </button>
            <button
                type="button"
                onClick={() => handleView('table')}
                className={`me-2 ps-2 pe-2 pt-1 pb-1 btn ${
                    displayType === 'table' ? 'btn-info' : 'btn-soft-info waves-effect waves-light'
                }`}
            >
                <span className="d-flex align-items-center fs-18">
                    <i className="ri-menu-fill"></i>
                </span>
            </button>
        </>
    );
};

export const capitalizeFirstLetter = (string: any) => {
    return string?.charAt?.(0)?.toUpperCase() + string?.slice?.(1)?.toLowerCase();
};

export const handleSaveText = (type: any) => {
    switch (type) {
        case 'edit':
            return 'Update';
        case 'add':
            return 'Save';
        case 'create':
            return 'Save';
        case 'clone':
            return 'Save';
        default:
            break;
    }
};

const handleRegexTypeMsg = (field: Record<string, boolean>): string => {
    const regexNames: Record<string, string> = {
        alphanumericspecial: 'alphanumeric special characters',
        alphanumeric: 'alphanumeric',
        alphabets: 'alphabets',
        alphabetsandspecialchars: 'alphabets and special characters',
        alphabetsandspecs: 'alphabets and special characters',
        floatdecimal: 'decimals'
    };
    let regexName = '';
    if (field && Object.keys(field)?.length > 0) {
        Object.keys(field).forEach((key) => {
            if (regexNames[key]) {
                regexName = regexNames[key];
            }
        });
    }
    return regexName;
};
export const generateValidationSchema: any = (formData: Field[]) => {
    const schema: { [key: string]: yup.Schema<any> } = {};
    formData.forEach((field: any) => {
        let validation: any;

        // Initialize validation based on field type
        switch (field.type) {
            case 'text':
                validation = yup.string();
                break;
            case 'email':
                validation = yup
                    .string()
                    .email('Invalid email address')
                    .matches(/@gmail\.com$/, 'Email should end with "@gmail.com"');
                break;
            case 'number':
                validation = yup.number();
                break;
            case 'object':
                validation = yup.object();
                break;
            case 'array':
                validation = field.mandatory ? yup.array().min(1, `Please select at least one ${field.label}`) : yup.array();
                break;
            default:
                validation = yup.string();
        }

        const { label, mandatory, minLen, maxLen, regex } = field;

        if (mandatory) {
            validation = validation.required(`${field.label} ${'is required'}`);
        }
        if (minLen) {
            validation = validation.min(field.minLen, `${field.label} must be at least ${field.minLen} characters`);
        }
        if (maxLen && field.type === 'number') {
            validation = validation.test(
                'max-length',
                `${field.label} should be ${maxLen} digits`,
                (value: any) => !value || value?.toString().length === maxLen
            );
        } else if (maxLen) {
            validation = validation.max(field.maxLen, `${field.label} cannot exceed ${field.maxLen} characters`);
        }
        if (regex) {
            if (field.type === 'text') {
                validation = validation.matches(new RegExp(regex), `${field.label} must be ${handleRegexTypeMsg(field)}`);
            } else {
                validation = validation.matches(new RegExp(regex), `${field.label} is not valid`);
            }
        }

        schema[field.value] = validation;
    });

    return yup.object().shape(schema);
};

export const generateInitialValues: any = (formData: any[]): any => {
    const initialValues: any = {};
    formData.forEach((field) => {
        switch (field.type) {
            case 'array':
                initialValues[field.value] = [];
                break;
            case 'checkbox':
                initialValues[field.value] = false;
                break;
            default:
                initialValues[field.value] = field?.initialValue || '';
        }
    });
    return initialValues;
};

/*
 * export const handleValidationSchema = (formSchema) => {
 *     let validationSchema = [];
 *     formSchema?.forEach((obj) => {
 *         if (obj?.fieldName) {
 *             let schema = {};
 *             let validations = {};
 *             schema['name'] = obj.fieldName;
 *             schema['label'] = obj.label;
 *             schema['pattern'] = obj.pattern ? obj.pattern : '';
 *             validations['nodeValue'] = [];
 *             if (obj.required) {
 *                 validations['nodeValue'].push('required');
 *             }
 *             if (obj.maxlength) {
 *                 validations['nodeValue'].push('maxLength');
 *                 validations['maxlength'] = obj.maxlength;
 *             }
 *             if (obj.minlength) {
 *                 validations['nodeValue'].push('minLength');
 *                 validations['minlength'] = obj.minlength;
 *             }
 *             if (obj.inputType && Object.keys(obj.inputType).length > 0) {
 *                 validations['nodeValue'].push(obj?.inputType?.value);
 *             }
 *             schema['value'] = '';
 *             schema['validations'] = validations;
 *             validationSchema.push(schema);
 *         }
 *     });
 *     return validationSchema;
 * };
 */

/*
 * export const getSortedData = (data, topIds, checkBy) => {
 *     let priorityData = [];
 *     let nonPriorityData = [];
 *     data?.forEach((obj) => {
 *         if (topIds && topIds?.includes(obj[`${checkBy}`])) {
 *             priorityData.push(obj);
 *         } else {
 *             nonPriorityData.push(obj);
 *         }
 *     });
 *     return priorityData.concat(nonPriorityData);
 * };
 */

export const handleGenderValues = (value: any) => {
    if (value === 'M') return 'Male';
    if (value === 'F') return 'Female';
    if (value === 'U') return 'Other';
};

export const convertToTitleCase = (string: any) => {
    string = string?.toLowerCase().replace(/\b\w/g, (letter: any) => {
        return letter?.toUpperCase();
    });
    return string;
};

export const handleSwitchModalBody = (status: any) => {
    return (
        <>
            <div className="text-centre">Are you sure you want to {status === 'active' ? 'inactivate' : 'activate'} this record?</div>
        </>
    );
};

export const restrictSpace = (e: any, props: any) => {
    if (props.alphanumericspecial) {
        const pattern = new RegExp(/^[ A-Za-z0-9_@.,~{}<>?`":;|()[!$=%^*()/#&+-]*$/g);

        if (!pattern.test(e.key)) {
            e.preventDefault();
        }
    }

    if (props.alphanumeric) {
        const pattern = new RegExp(/^[A-Za-z0-9 ]+$/g);

        if (!pattern.test(e.key)) {
            e.preventDefault();
        }
    }

    if (props.alphabets) {
        const pattern = new RegExp(/^[a-zA-Z\s]*$/);

        if (!pattern.test(e.key)) {
            e.preventDefault();
        }
    }

    if (props.alphabetsandspecialchars) {
        const pattern = new RegExp(/^[ a-zA-Z\n_@,~{}!=$<>?":|`%[;^*()./#&+-/s]*$/g);

        if (!pattern.test(e.key)) {
            e.preventDefault();
        }
    }

    if (props.alphabetsandspecs) {
        const pattern = new RegExp(/^[a-zA-Z-.()\s]*$/g);

        if (!pattern.test(e.key)) {
            e.preventDefault();
        }
    }

    if (props.floatdecimal) {
        const regex = /^0(?! \d+$)/;

        const stringRegex = /^[a-zA-Z!@#$%^&*)(+=,_-]$/;

        if (stringRegex.test(e.key) || e.which === 32 || (e?.currentTarget?.selectionStart === 0 && e.which === 190)) e.preventDefault();

        if (regex.test(e.key) && e?.currentTarget?.selectionStart === 0) {
            e.preventDefault();
        }
    }

    if (props.maxval) {
        const val = Number(props.value + e.key);

        if (val > props.maxval) {
            e.preventDefault();
        }
    }

    if (props.minval) {
        const val = Number(props.value + e.key);

        if (val < props.minval) {
            e.preventDefault();
        }
    }

    if (props.email) {
        const reg = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$');

        const stringRegex = /^[!#$%^&*)([+=,:;<>/{}`|~'?"]$/;

        if (stringRegex.test(e.key) || e.which === 32 || (e?.currentTarget?.selectionStart === 0 && e.which === 190)) {
            e.preventDefault();
        }

        if (!reg.test(e.key) && e?.currentTarget?.selectionStart === 0) {
            e.preventDefault();
        }
    }

    if (props.numbers) {
        const reg = new RegExp('^[0-9]+$');

        const stringRegex = /^[a-zA-Z!@#$%^&*)([+=,:;<>/{}`|~'?"_-]$/;

        if (stringRegex.test(e.key) || e.which === 32 || (e?.currentTarget?.selectionStart === 0 && e.which === 190)) {
            e.preventDefault();
        }

        if (!reg.test(e.key) && e?.currentTarget?.selectionStart === 0) {
            e.preventDefault();
        }
    }

    if (e.which === 32 && e?.currentTarget?.selectionStart === 0) e.preventDefault();

    if (props.type === 'number' && (e.which === 69 || e.which === 189 || e.which === 187 || e.which === 190)) e.preventDefault();
};

/*
 * export const trimValues = (values, schema, t) => {
 *     let flag = {};
 *     Object.keys(values).reduce((acc, key) => {
 *         acc[key] = typeof values[key] === 'string' ? values[key]?.trim() : values[key];
 *         if (Object.keys(acc)?.length > 0) {
 *             Object.keys(acc)?.forEach(() => {
 *                 schema?.forEach((obj) => {
 *                     if (obj?.value === key) {
 *                         if (obj?.inputType === 'input') {
 *                             if (acc[key] === '') {
 *                                 flag = { ...flag, [key]: `${t(obj?.label)} ${t('is required')}` };
 *                             } else {
 *                                 if (flag[key]) {
 *                                     delete flag[key];
 *                                 }
 *                             }
 *                         } else {
 *                             delete flag[key];
 *                         }
 *                     } else if (acc[key] !== '') {
 *                         delete flag[key];
 *                     }
 *                 });
 *             });
 *         }
 *         if (typeof values[key] !== 'string') {
 *             delete flag[key];
 *         }
 *         return flag;
 *     }, {});
 */

/*
 *     return flag;
 * };
 */

/*
 * export const getValuesToSend = (valueObj, formSchema, additionalkeysToSend) => {
 *     let dataToSend = {};
 *     let itemsToInclude = formSchema.map((obj) => obj.value)?.concat(additionalkeysToSend);
 *     Object.keys(valueObj)?.forEach((key) => {
 *         if (itemsToInclude.includes(key)) {
 *             dataToSend[key] = valueObj[key];
 *         }
 *     });
 *     return dataToSend;
 * };
 */

export const unixToISO = (dateInUnix: any) => {
    const ts = new Date(dateInUnix);
    return ts.toISOString();
};

export const searchByKey = (array: any, key: any, value: any) => {
    return array.filter((obj: any) => obj[key]?.toLowerCase()?.includes(value?.toLowerCase()));
};

export const convertToNewFormTemplateSchema = (sections: any) => {
    const newDataToSend: any = [];
    sections?.forEach((section: any) => {
        const copySection = JSON.parse(JSON.stringify(section));
        delete copySection.withVal;
        const layoutData: any = [];
        section?.information?.forEach((layout: any) => {
            if (layout?.type?.value?.toLowerCase() === 'text') {
                layoutData?.push({
                    key: 'common',
                    elementTypeValue: layout?.textDescription,
                    elementTypeCategory: layout?.type?.value,
                    title: layout?.title,
                    elementId: '',
                    elementName: '',
                    elementValue: '',
                    col: layout?.col,
                    row: layout?.row,
                    id: layout?.id
                });
            }
            if (layout?.type?.value?.toLowerCase() === 'asset_type') {
                layoutData?.push({
                    key: 'common',
                    elementTypeValue: layout?.assetType?.value,
                    elementTypeLabel: layout?.assetType?.label,
                    elementTypeId: layout?.assetType?.id,
                    elementTypeCategory: layout?.type?.value,
                    title: layout?.title,
                    elementId: layout?.asset?.assetId,
                    elementName: layout?.asset?.label,
                    assetLink: layout?.uploadItemLink,
                    col: layout?.col,
                    row: layout?.row,
                    id: layout?.id
                });
            }
            if (layout?.type?.value?.toLowerCase() === 'questionnaire_type') {
                layoutData?.push({
                    key: 'common',
                    elementTypeValue: layout?.questionnaireType?.value,
                    elementTypeLabel: layout?.questionnaireType?.label,
                    elementTypeId: layout?.questionnaireType?.id,
                    elementTypeCategory: layout?.type?.value,
                    title: layout?.title,
                    elementId: layout?.questionnaireTemplate?.questionnaireId,
                    elementName: layout?.questionnaireTemplate?.label,
                    col: layout?.col,
                    row: layout?.row,
                    id: layout?.id
                });
            }
        });
        copySection['information'] = layoutData;
        newDataToSend?.push(copySection);
    });
    return newDataToSend;
};

export const convertToOldFormTemplateSchema = (sections: any) => {
    const newDataToSend: any = [];
    sections?.forEach((section: any) => {
        const copySection = JSON.parse(JSON.stringify(section));
        copySection['withVal'] = true;
        const layoutData: any = [];
        section?.information?.forEach((layout: any) => {
            if (layout?.elementTypeCategory?.toLowerCase() === 'text') {
                layoutData?.push({
                    key: 'common',
                    type: {
                        label: 'Text',
                        value: layout?.elementTypeCategory
                    },
                    title: layout?.title,
                    textDescription: layout?.elementTypeValue,
                    col: layout?.col,
                    row: layout?.row,
                    withVal: true,
                    id: layout?.id
                });
            }
            if (layout?.elementTypeCategory?.toLowerCase() === 'asset_type') {
                layoutData?.push({
                    key: 'common',
                    type: {
                        label: 'Asset',
                        value: layout?.elementTypeCategory
                    },
                    title: layout?.title,
                    assetType: {
                        label: layout?.elementTypeLabel,
                        value: layout?.elementTypeValue,
                        id: layout?.elementTypeId
                    },
                    asset:
                        layout?.assetLink && layout?.assetLink?.length > 0
                            ? ''
                            : {
                                  assetId: layout?.elementId,
                                  label: layout?.elementName,
                                  value: layout?.elementId,
                                  attachment: '',
                                  id: uniqueID(10)
                              },
                    uploadItem: '',
                    uploadItemLink: layout?.assetLink,
                    col: layout?.col,
                    row: layout?.row,
                    withVal: true,
                    id: layout?.id
                });
            }
            if (layout?.elementTypeCategory?.toLowerCase() === 'questionnaire_type') {
                layoutData?.push({
                    key: 'common',
                    type: {
                        label: 'Questionnaire',
                        value: layout?.elementTypeCategory
                    },
                    title: layout?.title,
                    questionnaireType: {
                        value: layout?.elementTypeValue,
                        label: layout?.elementTypeLabel,
                        id: layout?.elementTypeId,
                        type: layout?.elementTypeCategory
                    },
                    questionnaireTemplate: {
                        label: layout?.elementName,
                        value: layout?.elementId,
                        questionnaireId: layout?.elementId
                    },
                    col: layout?.col,
                    row: layout?.row,
                    withVal: true,
                    id: layout?.id
                });
            }
        });
        copySection['information'] = layoutData;
        newDataToSend?.push(copySection);
    });
    return newDataToSend;
};

// Making an array Unique by Key and keep the latest occurrence of an object with the same key while making the array unique.
export const makeArrayUniqueByKey = (array: any, key: any) => {
    const uniqueArray: any = [];
    const uniqueKeys = new Set();

    array.forEach((obj: any) => {
        if (!uniqueKeys?.has(obj?.[key])) {
            uniqueArray?.push(obj);
            uniqueKeys.add(obj[key]);
        } else {
            const existingIndex = uniqueArray.findIndex((item: any) => item[key] === obj[key]);
            uniqueArray[existingIndex] = obj;
        }
    });

    return uniqueArray;
};

export const chunkArray = (chunkSize: any, array: any) => {
    const finalArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        finalArray?.push(chunk);
    }
    return finalArray;
};

export const userLabel = (userName: any) => {
    const name = userName?.split(' ');
    if (name?.length === 1) return name?.[0]?.charAt(0)?.toUpperCase();
    else return name?.[0]?.charAt(0)?.toUpperCase() + name?.[1]?.charAt(0)?.toUpperCase();
};

export const getDateAndDay = (timestamp: any) => {
    const DATE_OPTIONS: any = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
    const date = timestamp ? new Date(timestamp) : new Date();
    const day = date.toLocaleDateString('en-US', DATE_OPTIONS);
    const monthIndex = date.getMonth();
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const month = monthNames[monthIndex];
    const year = date.getFullYear();
    return {
        date: day?.split('/')?.[0]?.split(', ')?.[1]?.split(' ')?.[1],
        day: day?.split('/')?.[0]?.split(', ')?.[0],
        month,
        year
    };
};

export const getLastMonths = (lastInMonths: any) => {
    const date = new Date();
    const lastMonths = [],
        monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = lastInMonths + 1; i > 0; i--) {
        lastMonths.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
        date.setMonth(date.getMonth() - 1);
    }
    const unique = lastMonths.filter(onlyUnique);
    return unique?.reverse();
};

const onlyUnique = (value: any, index: any, array: any) => {
    return array.indexOf(value) === index;
};

export const getCurrentMonthAndFollowingMonths = () => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const allMonths = [];
    for (let i = currentMonth; i < months.length; i++) {
        allMonths.push(months[i]);
    }
    return allMonths;
};

export const convertImageToBase64 = (file: any, callback: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
};

export const askLocationPermission = async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
        // Permission API is not supported in this browser
        toast.error('Geolocation Permission API is not supported in this browser!');
        return false;
    }
    try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

        if (permissionStatus.state === 'granted') {
            // Location permission already granted
            return true;
        } else if (permissionStatus.state === 'prompt') {
            // Location permission prompt required
            const result = await new Promise((resolve) => {
                permissionStatus.onchange = () => resolve(permissionStatus.state === 'granted');
            });

            return result;
        } else {
            // Location permission denied
            return false;
        }
    } catch (error) {
        // toast.error('Error requesting location permission:', error);
        return false;
    }
};

export const getGeoLocation = async () => {
    const geolocationAPI = navigator.geolocation;
    let coordinates = { latitude: '', longitude: '' };
    if (!geolocationAPI) {
        toast.error('Geolocation API is not available in your browser!');
    } else {
        try {
            const position = await new Promise((resolve, reject) => {
                geolocationAPI.getCurrentPosition(resolve, reject);
            });
            const { coords }: any = position;
            coordinates = {
                latitude: coords.latitude,
                longitude: coords.longitude
            };
        } catch (error) {
            // toast.error('Something went wrong getting your location!');
        }
    }
    return coordinates;
};

export const getIPAddress = async () => {
    let ipAddress = '';
    await fetch('https://api.ipify.org?format=json')
        .then((response) => response.json())
        .then((data) => {
            // Access the IP address from the response
            ipAddress = data.ip;
        })
        .catch((error) => {
            toast.error(error);
        });
    return ipAddress;
};

/*
 *   export const encrypt = (plainText:any) => {
 *       let iv:nay = getRandomKey();
 *       let salt = getRandomKey();
 *       var key = generateKey(salt, CONSTANTS?.PASSPHRASE, CONSTANTS?.KEYSIZE, CONSTANTS?.ITERATION_COUNT);
 *       var encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: CryptoJS.enc.Hex.parse(iv) });
 *       var ciphertextBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
 *       return `${iv}::${salt}::${ciphertextBase64}`;
 *   };
 */

/*
 *  export const decrypt = (cipherText) => {
 *      const [iv, salt, encryptedText] = cipherText.split('::');
 *      var key = generateKey(salt, CONSTANTS?.PASSPHRASE, CONSTANTS?.KEYSIZE, CONSTANTS?.ITERATION_COUNT);
 *      var cipherParams = CryptoJS.lib.CipherParams.create({
 *          ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
 *      });
 *      var decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: CryptoJS.enc.Hex.parse(iv) });
 *      return decrypted.toString(CryptoJS.enc.Utf8);
 *  };
 */

export const getValuesInSchema = (schema: any, data: any) => {
    const filteredData: any = {};
    const keys = Object.keys(schema);
    keys.forEach((ele) => {
        for (const key in data) {
            if (ele === key) {
                filteredData[key] = data[key];
            }
        }
    });
    return filteredData;
};

export const base64ToBlob = (base64Data: any, contentType: any) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
};

export const base64UriToFile = (base64Uri: any, fileName: any) => {
    // Extract Base64 data from the URI
    const base64Data = base64Uri.split(',')[1];

    // Determine the content type (MIME type)
    const contentType = base64Uri.split(',')[0].match(/:(.*?);/)[1];

    // Convert Base64 data to Blob
    const blob = base64ToBlob(base64Data, contentType);

    // Create a File object
    return new File([blob], fileName, { type: contentType });
};

export const GetAuthModes = () => {
    return store.getState()?.AuthModes?.authModes;
};

export const LoggedInUser = () => {
    return store.getState()?.Login?.user;
};

export const getBaseUrl = () => {
    return store.getState()?.Login?.baseUrl;
};
