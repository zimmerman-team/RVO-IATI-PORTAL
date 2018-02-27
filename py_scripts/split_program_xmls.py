from iati_synchroniser.models import IatiXmlSource 


program_source_mapping = {
    "khed": "NL-KVK-27378529-18232",
    "orio": "NL-KVK-27378529-19390",
    "tf": "NL-KVK-27378529-23188",
    "tgt": "NL-KVK-27378529-23310",
    "psi": "NL-KVK-27378529-23408",
    "jcds": "NL-KVK-27378529-23583",
    "fwd": "NL-KVK-27378529-23710",
    "fdov": "NL-KVK-27378529-23877",
    "cbi": "NL-KVK-27378529-25403",
    "drr": "NL-KVK-27378529-25588",
    "gww": "NL-KVK-27378529-25717",
    "lsh": "NL-KVK-27378529-26225",
    "dggf": "NL-KVK-27378529-26663",
    "dfk": "NL-KVK-27378529-26742",
    "dss": "NL-KVK-27378529-27115",
    "wpm": "NL-KVK-27378529-27416",
    "pdp": "NL-KVK-27378529-27528",
    "dtb": "NL-KVK-27378529-27803",
    "fbk": "NL-KVK-27378529-29557",
    "ccs": "NL-KVK-27378529-GACC160005",
    "pfw": "NL-KVK-27378529-IM201601G"
}


for key in program_source_mapping:
    xml_file_name = key
    activity = Activity.objects.get(hierarchy=1, iati_identifier=program_source_mapping[key])
    title = activity.title.narratives.all()[0].content
    #
    source = IatiXmlSource(
        ref=xml_file_name,
        title="RVO "+title+" activities",
        type=1,
        publisher_id=1,
        source_url="http://rvo.oipa.nl/dummy-url-"+xml_file_name,
        time_to_parse=0,
        last_found_in_registry=None,
        iati_standard_version="2.02",
        is_parsed=True,
        added_manually=True,
        sha1="-",
        note_count=0
    )
    source.save()
    #
    Activity.objects.filter(hierarchy=2, relatedactivity__ref=program_source_mapping[key]).update(xml_source_ref=xml_file_name)
    Activity.objects.filter(hierarchy=1, iati_identifier=program_source_mapping[key]).update(xml_source_ref=xml_file_name)
    print program_source_mapping[key]
