<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>Function Property to Property</se:Name>
        <UserStyle>
            <se:Name>Function Property to Property</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name>Property Comparison Rule</se:Name>
                    <ogc:Filter xmlns="http://www.opengis.net/ogc">
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>posledni_hodnota</ogc:PropertyName>
                                <ogc:PropertyName>posledni_hodnota_sekundarni</ogc:PropertyName>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsGreaterThan>
                                <ogc:PropertyName>value1</ogc:PropertyName>
                                <ogc:PropertyName>value2</ogc:PropertyName>
                            </ogc:PropertyIsGreaterThan>
                            <ogc:PropertyIsLessThan>
                                <ogc:PropertyName>count1</ogc:PropertyName>
                                <ogc:PropertyName>count2</ogc:PropertyName>
                            </ogc:PropertyIsLessThan>
                            <ogc:PropertyIsGreaterThanOrEqualTo>
                                <ogc:PropertyName>threshold1</ogc:PropertyName>
                                <ogc:PropertyName>threshold2</ogc:PropertyName>
                            </ogc:PropertyIsGreaterThanOrEqualTo>
                            <ogc:Function name="lessThanOrEqualTo">
                                <ogc:PropertyName>posledni_hodnota</ogc:PropertyName>
                                <ogc:PropertyName>spa1h</ogc:PropertyName>
                            </ogc:Function>
                            <ogc:PropertyIsNotEqualTo>
                                <ogc:PropertyName>status</ogc:PropertyName>
                                <ogc:Literal>NULL</ogc:Literal>
                            </ogc:PropertyIsNotEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:Mark>
                                <se:WellKnownName>square</se:WellKnownName>
                                <se:Fill>
                                    <se:SvgParameter name="fill">#FF0000</se:SvgParameter>
                                </se:Fill>
                                <se:Stroke>
                                    <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                                    <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                                </se:Stroke>
                            </se:Mark>
                            <se:Size>5</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
            </se:FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor> 